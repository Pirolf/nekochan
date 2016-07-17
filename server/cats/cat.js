const {roundTo} = require('../helpers/math_helper');

function remainingFish(available, catsToFeed, portion) {
  const remainingCatsToFeed = Math.max(0, catsToFeed - Math.floor(available / portion));
  return {
    remaining: roundTo(available - portion * (catsToFeed - remainingCatsToFeed)),
    catsToFeed: remainingCatsToFeed
  };
}

class Cat {
  constructor(mealPortion, count) {
    this.mealPortion = mealPortion;
    this.count = count;
  }

  eat({catfish, salmon}) {
    const afterEatingCatfish = remainingFish(catfish, this.count, this.mealPortion.catfish);
    const afterEatingSalmon = remainingFish(salmon, afterEatingCatfish.catsToFeed, this.mealPortion.salmon);

    this.count -= afterEatingSalmon.catsToFeed;
    return {
      catfish: afterEatingCatfish.remaining,
      salmon: Math.min(salmon, afterEatingSalmon.remaining),
      starved: Math.max(0, afterEatingSalmon.catsToFeed)
    };
  }
}

module.exports = Cat;
