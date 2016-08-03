describe('GameApi', () => {
  const GameApi = require('../../../server/api/game_api');
  const CatsFactory = require('../../../server/factories/cats_factory');
  const IdleCat = require('../../../server/cats/idle_cat');
  const FisherCat = require('../../../server/cats/fisher_cat');
  const ExplorerCat = require('../../../server/cats/explorer_cat');

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
});
