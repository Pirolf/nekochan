const GameLoop = require('./game_loop');
let rooms = {};

module.exports = function(http) {
	const io = require('socket.io')(http);
	/*eslint-disable no-console */
	io.on('connection', (socket) => {
		console.log('a user connected');
		socket.on('authenticate', ({user: {name}, gameUUID}) => {
			socket.join(gameUUID, () => {
				rooms[socket.id] = gameUUID;
				const playerCount = (io.nsps['/'].adapter.rooms[gameUUID] || []).length;

				io.to(gameUUID).emit('joinGame', {
					message: `${name} joined the game`, 
					timestamp: Date.now()
				});

				console.log("playerCount: ", playerCount)
				if (playerCount === 1) {
					GameLoop.start(gameUUID, socket.id, (updatedGame) => {
						io.to(gameUUID).emit('gameUpdate', {
							game: updatedGame
						});						
					});
				}
			});
		});
		
		socket.on('disconnect', () => {
			const gameUUID = rooms[socket.id];
			const playerCount = (io.nsps['/'].adapter.rooms[gameUUID] || []) .length;
			if (gameUUID) {
				delete rooms[socket.id];
				console.log("saving ", gameUUID);
			}

			if (!playerCount) {
				console.log("stopping");
				GameLoop.stop(gameUUID, socket.id);
			}
			console.log('a user disconnected');
		});
	});
	/*eslint-enable no-console */
};