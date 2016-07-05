function roundTo(num, digits) {
  return parseInt(num.toFixed(digits), 10);
}

module.exports = {
  roundTo
};
