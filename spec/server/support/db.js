const mongoose = require('mongoose');

module.exports = {
  dbSetup: () => {
    beforeEach((done) => {
      mongoose.Promise = require('es6-promise').Promise;
      mongoose.connect('mongodb://localhost:28017/nekochan-test', done);
    });
  },
  dbTeardown: () => {
    afterEach((done) => {
      mongoose.connection.db.dropDatabase();
      mongoose.disconnect(done);
    });
  }
};
