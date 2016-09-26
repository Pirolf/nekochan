require('es6-promise').polyfill();
const jasmineAsync = require('jasmine-async-suite');
const mongoose = require('mongoose');

jasmineAsync.install();

function timeout(t) {
  return new Promise((resolve, reject) => {
    setTimeout(resolve, t);
  });
}

Object.assign(global, {timeout});

beforeEach.async(async () => {
  mongoose.Promise = require('es6-promise').Promise;
  const setupDB = new Promise((resolve, reject) => {
    mongoose.connect('mongodb://localhost:28017/nekochan-test', resolve);
  });
  await setupDB;
});

afterEach.async(async () => {
  mongoose.connection.db.dropDatabase();
  const disconnect = new Promise((resolve, reject) => {
    mongoose.disconnect(resolve);
  });
  await disconnect;
  await timeout(1);
});

afterAll(() => {
  jasmineAsync.uninstall();
});
