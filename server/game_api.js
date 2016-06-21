const Game = require('./game');

const catProfessions = ['noProfession', 'explorer'];

function generateCats(game, query) {
	const {cats} = game;
	const totalCats = catProfessions.map(profession => cats[profession].count).reduce((prev, current) => {
		return prev + current;
	}, 0);

	const {resources: {salmon: salmons}} = game;
  if (salmons / totalCats > 0.2) {
    const newCats = Math.floor((salmons - totalCats) / 2);
    return query.update({
      $inc: {
        'resources.salmon': -newCats * 2,
        'cats.noProfession.count': newCats
      }
    });
  }

  return query;
}

function fish(game) {

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
