const Cat = require('./cat');

class ExplorerCat extends Cat {
  constructor(count) {
    super({
      catfish: 0.7,
      salmon: 0.3
    }, count);
  }
}

module.exports = ExplorerCat;
