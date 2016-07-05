class Cat {
  constructor(mealPortion, count) {
    this.mealPortion = mealPortion;
    this.count = count;
  }

  eat({catfish, salmon}) {
    const mealPortion = this.mealPortion;
    // if (catfish + salmon <= 0) {
    //   const totalCats = this.count;
    //   this.count = 0;
    //   return {catfish: 0, salmon: 0, starved: totalCats};
    // }

    const catfishNeeded = this.count * mealPortion.catfish;
    if (catfish > catfishNeeded) {
        return {catfish: catfish - catfishNeeded, salmon, starved: 0};
    }

    const catsFedWithCatfish = Math.floor(catfish / mealPortion.catfish);
    const catfishEaten = catsFedWithCatfish * mealPortion.catfish;
    const salmonNeeded = (this.count - catsFedWithCatfish) * mealPortion.salmon;
    if (salmon > salmonNeeded) {
      return {
        catfish: catfish - catfishEaten,
        salmon: salmon - salmonNeeded,
        starved: 0
      };
    }

    const catsFedWithSalmon = Math.floor(salmon / mealPortion.salmon);
    const salmonEaten = catsFedWithSalmon * mealPortion.salmon;
    const unfed = this.count - catsFedWithCatfish - catsFedWithSalmon;
    this.count -= unfed;
    return {
      catfish: catfish - catfishEaten,
      salmon: salmon - salmonEaten,
      starved: unfed
    };
  }
}

module.exports = Cat;
