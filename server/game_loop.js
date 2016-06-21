const Game = require('./game');
const GameApi = require('./game_api');
const {Query} = require('mongoose');

let gameStates = {};

function rejectOnErr(err) {
  console.log(err);
  reject(err);
}

async function update(id) {
	const date = new Date(Date.now());
	console.log(date.toString());

	return new Promise(async (resolve, reject) => {
    const baseQuery = Game.findById(id);
    baseQuery.exec((err, game) => {
      const gameQuery = GameApi.generateCats(game, baseQuery);
      gameQuery.exec((err, savedGame) => {
        if (!savedGame.nModified) {
          resolve(game);
          return;
        }
        resolve(savedGame);
      });
    });
	});
}

async function run(id, callback) {
  return new Promise(async (resolve, reject) => {
		const updatedGame = await update(id);
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

			const key = `${gameUUID}::${socketID}`;
			gameStates[key] = true;
			console.log("game started", gameStates)

			while (gameStates[key]) {
				await run(game._id, callback);
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
