require('../../spec_helper');

describe('Api handlers', () => {
  const Handlers = require('../../../server/handlers/api_handlers');
  const Game = require('../../../server/models/game');
  const mongoose = require('mongoose');
  const uuid = require('uuid');

  let mockRes;

  beforeEach((done) => {
    mockRes = jasmine.createSpyObj('res', ['send', 'sendStatus'])
    spyOn(uuid, 'v1').and.returnValue('abc123');

    mongoose.Promise = require('es6-promise').Promise;
    mongoose.connect("mongodb://localhost:28017/nekochan-test", done);
  });

  afterEach((done) => {
    mongoose.connection.db.dropDatabase();
    mongoose.disconnect(done);
  });

  describe('#createGame', () => {
    it.async('creates a game and responds with uuid', async () => {
      MockPromise.uninstall();
      await Handlers.createGame({user: {facebook: {id: 'some-fb-id'}}}, mockRes);
      expect(mockRes.send).toHaveBeenCalledWith({uuid: 'abc123'});

      mockRes.send.calls.reset();
      await Handlers.getGame({params: {uuid: 'abc123'}}, mockRes);
      const game = mockRes.send.calls.mostRecent().args[0]
      expect(game).toEqual(jasmine.objectContaining({
        uuid: 'abc123',
        users: ['some-fb-id']
      }));
      expect(game.cats.explorer.locations).toEqual([jasmine.objectContaining({name: 'base', explorerCount: 0})]);
    });
  });

  describe('#getGame', () => {
    beforeEach(() => {
      const fakeQuery = jasmine.createSpyObj('findGame', ['exec']);
      fakeQuery.exec.and.returnValue(Promise.reject());
      spyOn(Game, 'findOne').and.returnValue(fakeQuery);
    });

    it.async('returns 422 when game cannot be found', async () => {
      MockPromise.uninstall();
      await Handlers.getGame({params: {uuid: 'non-existent'}}, mockRes);
      expect(mockRes.sendStatus).toHaveBeenCalledWith(422);
    });
  });
});
