require('../../spec_helper');

describe('Game model', () => {
  let game, Game;
  beforeEach(() => {
    Game = require('../../../server/models/game');
  });

  describe('#arePlacesValid', () => {
    beforeEach(() => {
      game = new Game({ map: { place1: {}, place2: {}, place3: {} } });
    });

    it('returns true when all places are valid', () => {
      expect(game.arePlacesValid('place1', 'place3')).toBe(true);
    });

    it('returns false when not all places are valid', () => {
      expect(game.arePlacesValid('place2', 'non-existent')).toBe(false);
    });
  });

  describe('#distance', () => {
    let placeValidSpy;
    beforeEach(() => {
      const MapConfig = require('../../../server/map_config');
      spyOn(MapConfig, 'get').and.returnValue({ place1: { coords: [1, 2]}, place2: { coords: [4, 6]} });
      placeValidSpy = spyOn(Game.prototype, 'arePlacesValid');
      game = new Game();
    });

    it('returns distance between two places', () => {
      placeValidSpy.and.returnValue(true);
      expect(game.distance('place1', 'place2')).toBe(5);
    });

    it('returns < 0 when either place is invalid', () => {
      placeValidSpy.and.returnValue(false);
      expect(game.distance('place1', 'place2')).toBeLessThan(0);
    });
  });
});
