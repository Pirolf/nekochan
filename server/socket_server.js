const GameApi = require('./game_api');

module.exports = function(http) {
	const io = require('socket.io')(http);
	/*eslint-disable no-console */
	io.on('connection', (socket) => {
		console.log('a user connected');
		socket.on('authenticate', ({user: {name}, gameUUID}) => {
			socket.join(gameUUID, () => {
				io.to(gameUUID).emit('joinGame', {
					message: `${name} joined the game`, 
					timestamp: Date.now()
				});

				GameApi.start();
			});
		});
		
		socket.on('disconnect', () => {
			GameApi.stop();
			console.log('a user disconnected');
		});
	});
	/*eslint-enable no-console */
};