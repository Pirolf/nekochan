const Game = require('./game');
const catProfessions = ['noProfession', 'explorer'];

function fish(game, query) {
  const {cats: {fishercat: {count: fishercats}}} = game;
  let caughtFish = 0;
  for (let i=0; i < fishercats; i++) {
    if (Math.random() > 0.75) {
      caughtFish += 1;
    }
  }

  return query.findOneAndUpdate({
      uuid: game.uuid,
    },{
      $inc: {
        'resources.salmon': caughtFish
      }
    },{
      new: true
    },
  );
}

function assignJob(gameUUID, {number, currentJob, newJob}) {
  const currentJobKey = `cats.${currentJob}.count`;
  const newJobkey = `cats.${newJob}.count`;

  return new Promise((resolve, reject) => {
		if (number <= 0) {
			reject(new Error("can only select a positive number of cats"));
			return;
		}

    Game.findOneAndUpdate(
      {
        uuid: gameUUID,
				[currentJobKey]: {
					$gte: number
				}
      },
      {
        $inc: {
          [currentJobKey]: -number,
          [newJobkey]: number
        },
      },
      {new: true},
      (err, game) => {
        if (err) {
					reject(err);
					return;
				}

				if (!game) {
					reject(new Error("no update"));
					return;
				}

        resolve(game);
      }
    );
  })
}

const GameApi = {
  fish,
  assignJob
};

module.exports = GameApi;
