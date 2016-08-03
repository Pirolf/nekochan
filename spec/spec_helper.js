require('es6-promise').polyfill();
const jasmineAsync = require('jasmine-async-suite');
const MockPromise = require('mock-promises');
const MockNextTick = require('./support/mock_next_tick');

jasmineAsync.install();

const globals = {MockPromise, MockNextTick};
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
