describe('Math helper', () => {
  const {roundTo} = require('../../../server/helpers/math_helper');
  describe('#roundTo', () => {
    it('rounds to 1 decimal point by default', () => {
      expect(roundTo(1.36)).toBe(1.4);
    });

    it('rounds up', () => {
      expect(roundTo(1.347, 2)).toBe(1.35);
    });

    it('rounds down', () => {
      expect(roundTo(1.342, 2)).toBe(1.34);
    });
  });
});
