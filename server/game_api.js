const Game = require('./game');

const catProfessions = ['noProfession', 'explorer'];
function generateCats(game) {
	const {cats} = game;
	const totalCats = catProfessions.map(profession => cats[profession].count).reduce((prev, current) => {
		return prev + current;
	}, 0);

	const salmons = game.resources.salmon;
	if (salmons / totalCats > 1.5) {
		const newCats = Math.floor((salmons - totalCats) / 2);
		game.cats.noProfession.count = cats.noProfession.count + newCats;
		game.resources.salmon = salmons - newCats * 2;
	}
	return game;
}

function assignJob(gameUUID, {number, currentJob, newJob}) {
  const currentJobKey = `cats.${currentJob}.count`;
  const newJobkey = `cats.${newJob}.count`
  return new Promise((resolve, reject) => {
    Game.findOneAndUpdate(
      {uuid: gameUUID},
      {$inc: {
        [currentJobKey]: -number,
        [newJobkey]: number
      }},
      {new: true},
      (err, game) => {
        if (err) reject(err);
        resolve(game);
      }
    );
  })
}

const GameApi = {
	generateCats,
  assignJob
};

module.exports = GameApi;
