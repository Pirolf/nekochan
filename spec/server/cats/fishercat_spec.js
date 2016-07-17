describe('FisherCat', () => {
  let fishercat;
  const FisherCat = require('../../../server/cats/fisher_cat');
  beforeEach(() => {
    fishercat = new FisherCat(2);
  });

  describe('#fish', () => {
    describe('5% chance', () => {
      beforeEach(() => {
        spyOn(Math, 'random').and.returnValue(0.03);
      });

      it('catches salmon', () => {
        expect(fishercat.fish({salmon: 1, catfish: 1})).toEqual({salmon: 3, catfish: 1});
      });
    });

    describe('20% chance', () => {
      beforeEach(() => {
        spyOn(Math, 'random').and.returnValue(0.2);
      });

      it('catches catfish', () => {
        expect(fishercat.fish({salmon: 1, catfish: 1})).toEqual({catfish: 3, salmon: 1});
      });
    });
  });
});
