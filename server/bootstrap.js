require('babel-core/register');
require('babel-polyfill');

const app = require('./app')();
const server = require('http').Server(app);

require('./socket_server')(server);

server.listen(process.env.PORT || 3000, function() {
  process.send && process.send({cmd: 'ready'});
});

module.exports = app;
