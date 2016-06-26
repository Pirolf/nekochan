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

		socket.on('errors', (data) => {
			Actions.updateErrors(data);
		});
	},

	authenticate: ({user, gameUUID}) => {
		socket.emit('authenticate', {user, gameUUID});
	},

  assignJob: async (formData) => {
		await Actions.clearErrors();
    socket.emit('assign-job', formData);
  },
};

module.exports = Client;
