const Cat = require('./cat');

class IdleCat extends Cat {
  constructor(count) {
    super({
      catfish: 0.2,
      salmon: 0.1
    }, count);
  }
}

module.exports = IdleCat;
