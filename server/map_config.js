const mapConfig = {
  base: {
    distance: 0,
    type: "base",
    requirements: {}
  },
  takashima: {
    distance: 450,
    type: "base",
    requirements: {salmon: 3}
  }
};

module.exports = {
  getConfig() {
    return mapConfig;
  }
};
