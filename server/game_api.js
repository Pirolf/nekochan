const Game = require('./game');
let gameStates = {};

function update() {
	const date = new Date(Date.now())
	console.log(date.toString());
}

async function run() {
	return new Promise((resolve, reject) => {
		update();
		setTimeout(() => resolve(), 3000);
	});
}

const GameApi = {
	start: async (gameUUID) => {
		Game.findOne({uuid: gameUUID}, async (err, game) => {
			if (err) {
				console.log(err);
				return;
			}
			
			gameStates[gameUUID] = true;
			while (gameStates[gameUUID]) {
				await run();
			}
		});
	},

	stop: (gameUUID) => {
		Game.findOne({uuid: gameUUID}, (err, game) => {
			if (err) {
				console.log(err);
				return;
			}
			
			delete gameStates[gameUUID];
			console.log("game stopped")
		});
	}
};

module.exports = GameApi;