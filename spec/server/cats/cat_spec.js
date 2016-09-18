describe('Cats', () => {
  const Cat = require('../../../server/cats/cat');
  describe('#eat', () => {
    let cat;
    beforeEach(() => {
      cat = new Cat({catfish: 0.5, salmon: 0.2}, 10);
    });

    describe('when there is enough catfish', () => {
      it('feeds all the cats', () => {
        const postMeal = cat.eat({catfish: 6, salmon: 2});
        expect(postMeal).toEqual({catfish: 1, salmon: 2, starved: 0});
        expect(cat.count).toBe(10);
      });
    });

    describe('when there is not enough catfish', () => {
      describe('when there is enough salmon', () => {
        it('feeds all the cats', () => {
          const postMeal = cat.eat({catfish: 3.2, salmon: 2});
          expect(postMeal.catfish).toBeCloseTo(0.2, 2);
          expect(postMeal).toEqual(jasmine.objectContaining({salmon: 1.2, starved: 0}));
          expect(cat.count).toBe(10);
        });
      });

      describe('when there is not enough salmon', () => {
        it('starve unfed cats', () => {
          const postMeal = cat.eat({catfish: 3.2, salmon: 0.5});
          expect(postMeal).toEqual({catfish: 0.2, salmon: 0.1, starved: 2});
          expect(cat.count).toBe(8);
        });
      });
    });
  });
});
