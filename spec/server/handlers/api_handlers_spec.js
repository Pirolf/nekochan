require('../../spec_helper');

describe('Api handlers', () => {
  const Handlers = require('../../../server/handlers/api_handlers');
  const mongoose = require('mongoose');
  const uuid = require('uuid');
  const {dbSetup, dbTeardown} = require('../support/db');
  let Game;

  dbSetup();
  dbTeardown();

  let mockRes;
  beforeEach(() => {
    Game = require('../../../server/models/game');
    mockRes = jasmine.createSpyObj('res', ['send', 'sendStatus']);
    spyOn(uuid, 'v4').and.returnValue('abc123');
  });

  describe('#createGame', () => {
    const mapConfig = {
      base: { type: 'base', distance: 3 },
      notBase: { type: 'non-base', distance: 5 },
      anotherBase: { type: 'base', distance: 4 }
    };

    const map = {
      base: { resources: {banana: {chance: 0.1}}},
      anotherBase: { resources: {apple: {chance: 0.5}}}
    };

    beforeEach(() => {
      const MapConfig = require('../../../server/map_config');
      spyOn(MapConfig, 'get').and.returnValue(mapConfig);

      const GameMap = require('../../../server/models/game_map');
      spyOn(GameMap, 'get').and.returnValue(map);
    });

    it.async('creates a game and responds with uuid', async () => {
      await Handlers.createGame({user: {facebook: {id: 'some-fb-id'}}}, mockRes);
      expect(mockRes.send).toHaveBeenCalledWith({uuid: 'abc123'});

      mockRes.send.calls.reset();
      await Handlers.getGame({params: {uuid: 'abc123'}}, mockRes);
      const game = mockRes.send.calls.mostRecent().args[0];
      expect(game).toEqual(jasmine.objectContaining({
        uuid: 'abc123',
        users: ['some-fb-id']
      }));
      const expectedLocations = [
        jasmine.objectContaining({ name: 'base', explorerCount: 0}),
        jasmine.objectContaining({ name: 'anotherBase', explorerCount: 0})
      ];
      expect(game.cats.explorer.locations).toEqual(expectedLocations);

      const expectedMap = { base: map.base, anotherBase: map.anotherBase};
      expect(game.map).toEqual(map);
    });
  });

  describe('#getGame', () => {
    beforeEach(() => {
      const fakeQuery = jasmine.createSpyObj('findGame', ['exec']);
      fakeQuery.exec.and.returnValue(Promise.reject());
      spyOn(Game, 'findOne').and.returnValue(fakeQuery);
    });

    it.async('returns 422 when game cannot be found', async () => {
      await Handlers.getGame({params: {uuid: 'non-existent'}}, mockRes);
      expect(mockRes.sendStatus).toHaveBeenCalledWith(422);
    });

    it.async('returns both game and techTree', () => {
    });
  });
});
