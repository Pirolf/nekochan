describe('GameApi', () => {
  const GameApi = require('../../../server/api/game_api');
  const CatsFactory = require('../../../server/factories/cats_factory');
  const IdleCat = require('../../../server/cats/idle_cat');
  const FisherCat = require('../../../server/cats/fisher_cat');
  const ExplorerCat = require('../../../server/cats/explorer_cat');
  const mongoose = require('mongoose');

  function timeout(t) {
    return new Promise((resolve, reject) => {
      setTimeout(resolve, t);
    });
  }

  describe('#assignJob', () => {
    const Game = require('../../../server/models/game');
    let gameUUID, game, saveSpy;
    beforeEach.async(async () => {
      MockPromise.uninstall();

      mongoose.Promise = require('es6-promise').Promise;
      const setupDB = new Promise((resolve, reject) => {
        mongoose.connect("mongodb://localhost:28017/nekochan-test", resolve);
      });
      await setupDB;

      gameUUID = require('uuid').v4();
      game = await Game.create({
        users: ['abc123'],
        uuid: gameUUID,
        cats: {
          noProfession: {count: 4},
          explorer: {count: 2, locations: [{name: 'base', explorerCount: 2}]},
          fishercat: {count: 1}
        }
      });
    });

    afterEach.async(async () => {
      mongoose.connection.db.dropDatabase();
      const disconnect = new Promise((resolve, reject) => {
        mongoose.disconnect(resolve);
      })
      await disconnect;
      await timeout(1);
    });

    it.async('assigns the cats from old job to new job', async () => {
      const updatedGame = await GameApi.assignJob(gameUUID, {number: 2, currentJob: 'noProfession', newJob: 'fishercat'});
      expect(updatedGame.cats).toEqual(jasmine.objectContaining({
        noProfession: jasmine.objectContaining({count: 2}),
        explorer: jasmine.objectContaining({count: 2, locations: [jasmine.objectContaining({name: 'base', explorerCount: 2})]}),
        fishercat: jasmine.objectContaining({count: 3})
      }));
    });

    describe('when old job is explorer', () => {
      it.async('updates the number of cats at base', async () => {
        const updatedGame = await GameApi.assignJob(gameUUID, {number: 1, currentJob: 'explorer', newJob: 'fishercat'});
        expect(updatedGame.cats).toEqual(jasmine.objectContaining({
          noProfession: jasmine.objectContaining({count: 4}),
          explorer: jasmine.objectContaining({count: 1, locations: [jasmine.objectContaining({name: 'base', explorerCount: 1})]}),
          fishercat: jasmine.objectContaining({count: 2})
        }));
      });
    });

    describe('when new job is explorer', () => {
      it.async('updates the number of cats at base', async () => {
        const updatedGame = await GameApi.assignJob(gameUUID, {number: 1, currentJob: 'noProfession', newJob: 'explorer'});
        expect(updatedGame.cats).toEqual(jasmine.objectContaining({
          noProfession: jasmine.objectContaining({count: 3}),
          explorer: jasmine.objectContaining({count: 3, locations: [jasmine.objectContaining({name: 'base', explorerCount: 3})]}),
          fishercat: jasmine.objectContaining({count: 1})
        }));
      });
    });

    describe('when number of cats < 0', () => {
      it.async('rejects with error', async () => {
        try {
          await GameApi.assignJob(gameUUID, {number: -1, currentJob: 'explorer', newJob: 'fishercat'})
        } catch (e) {
          expect(e).toEqual(jasmine.any(Error));
          const updatedGame = await Game.findOne({uuid: gameUUID}).exec();
          expect(updatedGame.cats).toEqual(jasmine.objectContaining({
            noProfession: jasmine.objectContaining({count: 4}),
            explorer: jasmine.objectContaining({count: 2, locations: [jasmine.objectContaining({name: 'base', explorerCount: 2})]}),
            fishercat: jasmine.objectContaining({count: 1})
          }));
        }
      });
    });
  });

  describe("#consumeResources", () => {
    let game;
    beforeEach(() => {
      game = {
        uuid: 123,
        cats: {
          noProfession: {count: 3},
          fishercat: {count: 2},
          explorer: {count: 4}
        },
        resources: {
          catfish: 3.2,
          salmon: 2.3
        }
      };

      spyOn(CatsFactory, 'makeCats').and.callThrough();
      spyOn(IdleCat.prototype, 'eat').and.returnValue({catfish: 3.0, salmon: 1.8})
      spyOn(FisherCat.prototype, 'eat').and.returnValue({catfish: 2.5, salmon: 1.4});
      spyOn(ExplorerCat.prototype, 'eat').and.returnValue({catfish: 1.3, salmon: 0.6});
    });

    it("updates resources and cat counts", () => {
      GameApi.consumeResources(game);

      expect(CatsFactory.makeCats).toHaveBeenCalled();
      expect(IdleCat.prototype.eat).toHaveBeenCalledWith({catfish: 3.2, salmon: 2.3});
      expect(FisherCat.prototype.eat).toHaveBeenCalledWith({catfish: 3.0, salmon: 1.8});
      expect(ExplorerCat.prototype.eat).toHaveBeenCalledWith({catfish: 2.5, salmon: 1.4});
      expect(game).toEqual(jasmine.objectContaining({
        resources: { catfish: 1.3, salmon: 0.6 },
        cats: {
          explorer: {
            count: jasmine.any(Number),
          },
          fishercat: {
            count: jasmine.any(Number),
          },
          noProfession: {
            count: jasmine.any(Number),
          }
        }
      }));
    });
	});

  describe('#fish', () => {
    let game, fisherCat, fishSpy;
    beforeEach(() => {
      game = {
        uuid: 123,
        cats: {
          fishercat: {count: 2},
        },
        resources: {
          salmon: 5,
          catfish: 1,
        }
      };

      fisherCat = new FisherCat(2);
      spyOn(CatsFactory, 'makeFishercat').and.returnValue(fisherCat);
      fishSpy = spyOn(FisherCat.prototype, 'fish');
      fishSpy.and.returnValue({salmon: 7, catfish: 2});
    });

    it("updates fish and cat count", () => {
      GameApi.fish(game);
      expect(CatsFactory.makeFishercat).toHaveBeenCalledWith(2);
      expect(fishSpy).toHaveBeenCalledWith({salmon: 5, catfish: 1});
      expect(game).toEqual(jasmine.objectContaining({
        resources: {
          salmon: 7,
          catfish: 2
        },
      }));
    });
  });

  describe('#travel', () => {
    const Game = require('../../../server/models/game');
    let mockGame, mockFindQuery, mockFindOneAndUpdateQuery;

    beforeEach(() => {
      mockGame = {
        uuid: 'abc123',
        resources: {salmon: 22},
        cats: {
          explorer: {
            count: 6,
            locations: [{name: 'some-location', explorerCount: 5}, {name: 'takashima', explorerCount: 1}]
          }
        }
      };
      mockFindQuery = jasmine.createSpyObj('query', ['exec']);
      mockFindOneAndUpdateQuery = jasmine.createSpyObj('query', ['exec']);
      mockFindOneAndUpdateQuery.exec.and.returnValue(Promise.resolve('findOneAndUpdateResolve'));
      spyOn(Game, 'findOne').and.returnValue(mockFindQuery);
      spyOn(Game, 'findOneAndUpdate').and.returnValue(mockFindOneAndUpdateQuery);
    });

    describe('when requirements are met', () => {
      beforeEach(() => {
        mockFindQuery.exec.and.returnValue(Promise.resolve(mockGame));
      });

      it.async('send travellers to destination', async () => {
        const result = await GameApi.travel('abc123', {src: 'some-location', dest: 'takashima', travellerCount: 2});
        expect(Game.findOneAndUpdate).toHaveBeenCalledWith(
          {uuid: 'abc123'},
          {
            resources: {salmon: 16},
            'cats.explorer.locations': [{name: 'some-location', explorerCount: 3}, {name: 'takashima', explorerCount: 3}]
          },
          {new: true}
        );
        expect(result).toEqual('findOneAndUpdateResolve');
      });
    });

    describe('when requirements are not met', () => {
      beforeEach(() => {
        mockGame = {...mockGame, resources: {salmon: 5}};
        mockFindQuery.exec.and.returnValue(Promise.resolve(mockGame));
      });

      it.async('does nothing', async () => {
        const result = await GameApi.travel('abc123', {src: 'some-location', dest: 'takashima', travellerCount: 2});
        expect(Game.findOneAndUpdate).not.toHaveBeenCalled();
        expect(result).toEqual({requirementsNotMet: true});
      });
    });
  });
});
