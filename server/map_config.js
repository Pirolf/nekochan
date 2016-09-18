const mapConfig = {
  base: {
    coords: [0, 0],
    type: 'base',
    requirements: {}
  },
  takashima: {
    coords: [15, 30],
    type: 'base',
    requirements: {salmon: 3}
  }
};

module.exports = {
  get() {
    return mapConfig;
  }
};
