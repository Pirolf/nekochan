require('../../spec_helper');

describe('Api handlers', () => {
  let Handlers, Game, mockRes, uuid;

  beforeEach(() => {
    uuid = require('uuid');
    Handlers = require('../../../server/handlers/api_handlers');
    Game = require('../../../server/models/game');
    mockRes = jasmine.createSpyObj('res', ['send', 'sendStatus']);
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
      spyOn(uuid, 'v4').and.returnValue('abc123');

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
      const data = mockRes.send.calls.mostRecent().args[0];
      expect(data.game).toEqual(jasmine.objectContaining({
        uuid: 'abc123',
        users: ['some-fb-id']
      }));
      const expectedLocations = [
        jasmine.objectContaining({ name: 'base', explorerCount: 0}),
        jasmine.objectContaining({ name: 'anotherBase', explorerCount: 0})
      ];
      expect(data.game.cats.explorer.locations).toEqual(expectedLocations);

      const expectedMap = { base: map.base, anotherBase: map.anotherBase};
      expect(data.game.map).toEqual(map);
    });
  });

  describe('#getGame', () => {
    let gameUuid, techTree, TechTree;
    beforeEach.async(async () => {
      techTree = {
        fishing: {
          resources: {
            research: {salmon: 10}
          },
          prereqs: {
            other: {level: 3}
          }
        }
      };
      TechTree = require('../../../server/tech_tree.js');
      spyOn(TechTree, 'get').and.returnValue(techTree);

      gameUuid = uuid.v4(); 
      const game = await Game.create({
        uuid: gameUuid,
        resources: {catfish: 3, salmon: 5}
      });
      expect(game.uuid).toBe(gameUuid);
    });

    it.async('returns 422 when game cannot be found', async () => {
      await Handlers.getGame({params: {uuid: 'non-existent'}}, mockRes);
      expect(mockRes.sendStatus).toHaveBeenCalledWith(422);
    });

    it.async('returns both game and techTree', async () => {
      const data = await Handlers.getGame({params: {uuid: gameUuid}}, mockRes);
      expect(mockRes.send).toHaveBeenCalledWith({
        game: jasmine.objectContaining({
          uuid: gameUuid,
          resources: jasmine.objectContaining({catfish: 3, salmon: 5})
        }),
        techTree
      });
    });
  });
});
