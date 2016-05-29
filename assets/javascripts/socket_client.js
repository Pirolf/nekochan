const {Actions} = require('p-flux');

let socket;
const Client = {
	connect: () => {
		const io = require('socket.io-client/socket.io.js');
		socket = io();
		socket.on('joinGame', (data) => {
			Actions.updateActivityLogs(data);
		});

		socket.on('gameUpdate', (data) => {
			Actions.updateGame(data);
		});
	},

	authenticate: ({user, gameUUID}) => {
		socket.emit('authenticate', {user, gameUUID});
	}
};

module.exports = Client;