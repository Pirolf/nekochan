require('es6-promise').polyfill();
const jasmineAsync = require('jasmine-async-suite');

jasmineAsync.install();

afterAll(() => {
  jasmineAsync.uninstall();
});
