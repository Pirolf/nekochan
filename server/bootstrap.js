require('babel-core/register');
require('babel-polyfill');
require('es6-promise').polyfill();

const app = require('./app')();
const server = require('http').Server(app);
const mongoose = require('mongoose');
const config = require('../config/config');

mongoose.Promise = global.Promise;
mongoose.connect(config.db.url);

require('./socket_server')(server);

server.listen(process.env.PORT || 3000, function() {
  process.send && process.send({cmd: 'ready'});
});

module.exports = app;
