const gameMap = {
  base: {
    resources: {
      salmonJerky: {
        chance: {type: Number, default: 0.01, min: 0}
      }
    }
  },
  takashima: {
    resources: {
      blueberry: {
        chance: {type: Number, default: 0.01, min: 0},
        range: [Number]
      },
    }
  }
};

module.exports = {
  get() {
    return gameMap;
  }
};
