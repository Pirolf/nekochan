const io = require('socket.io-client/socket.io.js');
const socket = io();

const Client = {
	meow: () => {
		socket.emit('cat', "meow");
	}
};

module.exports = Client;