const Cat = require('./cat');

class FisherCat extends Cat {
  constructor(count) {
    super({
      catfish: 0.4,
      salmon: 0.2
    }, count);
  }

  fish({salmon, catfish}) {
    let caughtSalmon = 0, caughtCatfish = 0;
    for (let i=0; i < this.count; i++) {
      const chance = Math.random();
      if (chance < 0.05) {
        caughtSalmon += 1;
        continue;
      }

      if (chance < 0.25) {
        caughtCatfish += 1;
      }
    }
    return {salmon: salmon + caughtSalmon, catfish: catfish + caughtCatfish};
  }
}

module.exports = FisherCat;
