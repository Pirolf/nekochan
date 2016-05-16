let socket;
const Client = {
	connect: () => {
		const io = require('socket.io-client/socket.io.js');
		socket = io();
		socket.on('joinGame', (msg) => {
			console.log(msg);
		});
	},

	authenticate: ({user, gameUUID}) => {
		socket.emit('authenticate', {user, gameUUID});
	}
};

module.exports = Client;