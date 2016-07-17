describe('CatsFactory', () => {
  const {makeCats} = require('../../../server/factories/cats_factory');
  describe('#makeCats', () => {
    it("makes all kinds of cats", () => {
      expect(makeCats({explorer: 3, fishercat: 4, noProfession: 1})).toEqual({
        explorer: jasmine.objectContaining({count: 3}),
        fishercat: jasmine.objectContaining({count: 4}),
        noProfession: jasmine.objectContaining({count: 1})
      });
    });
  });
});
