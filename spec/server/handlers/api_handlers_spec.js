require('../../spec_helper');

describe('Api handlers', () => {
  const Handlers = require('../../../server/handlers/api_handlers');
  const Game = require('../../../server/models/game');
  const mongoose = require('mongoose');
  const uuid = require('uuid');
  const {dbSetup, dbTeardown} = require('../support/db');

  dbSetup();
  dbTeardown();

  let mockRes;
  beforeEach(() => {
    mockRes = jasmine.createSpyObj('res', ['send', 'sendStatus'])
    spyOn(uuid, 'v4').and.returnValue('abc123');
  });

  describe('#createGame', () => {
    const map = { base: { type: "base" }, notBase: { type: "non-base" } };

    beforeEach(() => {
      const MapConfig = require('../../../server/map_config');
      spyOn(MapConfig, 'getConfig').and.returnValue(map);
    });

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
      const expectedLocations = [jasmine.objectContaining({name: 'base', explorerCount: 0})];
      expect(game.cats.explorer.locations).toEqual(expectedLocations);
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
