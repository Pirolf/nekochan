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
    beforeEach(() => {
      game = new Game({
        map: { place1: { coords: [1, 2]}, place2: { coords: [4, 6]} }
      });
    });
    
    it('returns distance between two places', () => {
      expect(game.distance('place1', 'place2')).toBe(5);
    });
  });
});
