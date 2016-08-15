function roundTo(num, digits = 1) {
  return Number(num.toFixed(digits));
}

function stringToInt(s) {
  const i = +s;
  if (require('lodash.isnan')(i)) {
    return {ok: false};
  }
  return {ok: true, number: i};
}

module.exports = {
  roundTo,
  stringToInt
};
