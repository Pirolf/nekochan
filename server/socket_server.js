const GameLoop = require('./game_loop');
const GameApi = require('./api/game_api');
const TechApi = require('./api/tech_api');
const User = require('./models/user');
const camelCase = require('camelcase');

let rooms = {};

function isAuthorized({id, token}) {
  return User.findOne({'facebook.id': id, 'facebook.token': token}).exec().then(() => Promise.resolve(true), () => Promise.resolve(false));
}

function socketEvent({name, Api}, socket, gameUUID) {
  socket.on(name, (data) => {
    const result = Api[camelCase(name)](gameUUID, data);
    result.then((game) => {
      io.to(gameUUID).emit('gameUpdate', game);
    }, (err) => {
      io.to(gameUUID).emit('errors', {[name]: err.message});
    });
  });
};

module.exports = function(server) {
	const io = require('socket.io')(server);
	/*eslint-disable no-console */
	io.on('connection', (socket) => {
		socket.on('authenticate', async ({user: {name, id, token}, gameUUID}) => {
      const authorized = await isAuthorized({id, token});
      if (!authorized) {
        socket.disconnect(true);
        return;
      }

			socket.join(gameUUID, () => {
        console.log('a user connected');
				rooms[socket.id] = gameUUID;
				const playerCount = (io.nsps['/'].adapter.rooms[gameUUID] || []).length;

				io.to(gameUUID).emit('joinGame', {
					message: `${name} joined the game`,
					timestamp: Date.now()
				});

				console.log('playerCount: ', playerCount);
				if (playerCount === 1) {
					GameLoop.start(gameUUID, socket.id, (updatedGame) => {
						io.to(gameUUID).emit('gameUpdate', updatedGame);
					});
				}
        //game
        ['assign-job', 'create-cats', 'create-trip'].forEach(name => socketEvent({name, Api: GameApi}, socket, gameUUID));
        ['research', 'upgrade'].forEach(name => socketEvent({name, Api: TechApi}, socket, gameUUID));
      });
		});

		socket.on('disconnect', () => {
			const gameUUID = rooms[socket.id];
			const playerCount = (io.nsps['/'].adapter.rooms[gameUUID] || []) .length;
			if (gameUUID) {
				delete rooms[socket.id];
				console.log('saving ', gameUUID);
			}

			if (!playerCount) {
				console.log('stopping');
				GameLoop.stop(gameUUID, socket.id);
			}
			console.log('a user disconnected');
		});
	});
	/*eslint-enable no-console */
};
