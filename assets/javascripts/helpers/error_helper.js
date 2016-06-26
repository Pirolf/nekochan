function extractError(key, errors) {
  if (!errors[key]) {
    return {};
  }
  return {[key]: errors[key]};
}

module.exports = {
  extractError
}
