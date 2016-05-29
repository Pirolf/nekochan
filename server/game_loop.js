const Game = require('./game');
const GameApi = require('./game_api');
let gameStates = {};

async function update(game) {
	const date = new Date(Date.now())
	console.log(date.toString());
	game = GameApi.generateCats(game);
	return new Promise((resolve, reject) => {
		game.save((err) => {
			if (err) {
				console.log(err);
				reject(err);
			}

			resolve(game);
		});	
	})
}

async function run(game, callback) {
	return new Promise(async (resolve, reject) => {
		const updatedGame = await update(game);
		if (callback) callback(updatedGame);
		setTimeout(() => resolve(updatedGame), 5000);
	});
}

const GameLoop = {
	start: async (gameUUID, socketID, callback) => {
		Game.findOne({uuid: gameUUID}, async (err, game) => {
			if (err) {
				console.log(err);
				return;
			}

			console.log("game started before", gameStates)

			let updatedGame = game;
			const key = `${gameUUID}::${socketID}`;
			gameStates[key] = true;
			console.log("game started", gameStates)

			while (gameStates[key]) {
				updatedGame = await run(updatedGame, callback);
			}
			console.log("game really stopped")
		});
	},

	stop: (gameUUID, socketID) => {
		Game.findOne({uuid: gameUUID}, (err, game) => {
			if (err) {
				console.log(err);
				return;
			}

			const key = `${gameUUID}::${socketID}`
			delete gameStates[key];				
		});
	}
};

module.exports = GameLoop;