function baseReject(reject, err, statusCode) {
  if (err) {
    reject(err);
    return true;
  }
  if (statusCode != 200) {
    reject({statusCode});
    return true;
  }
  return false;
}

function redirect(url) {
  window.location = url;
}

module.exports = {
  baseReject,
  redirect
};
