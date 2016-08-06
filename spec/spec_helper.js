require('es6-promise').polyfill();
const jasmineAsync = require('jasmine-async-suite');
const MockPromise = require('mock-promises');

jasmineAsync.install();

const globals = {MockPromise};
Object.assign(global, globals);

beforeEach(() => {
  MockPromise.install(require('es6-promise').Promise);
});

afterEach(() => {
  MockPromise.contracts.reset();
});

afterAll(() => {
  MockPromise.uninstall();
  jasmineAsync.uninstall();
});
