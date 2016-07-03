const Game = require('./game');
const catProfessions = ['noProfession', 'explorer'];

function createCats(uuid, {catsToCreate}) {
  return new Promise((resolve, reject) => {
      Game.findOne({uuid: uuid}, (err, game) => {
        if (err) {
          reject(new Error("game not found"));
          return;
        }
        const {resources: {catfish}} = game;
        if (catfish < 10 * catsToCreate) {
          reject(new Error("not enough cat fish"));
          return;
        }

        Game.findOneAndUpdate({uuid: uuid}, {
            $inc: {
              'resources.catfish': -10 * catsToCreate,
              'cats.noProfession.count': catsToCreate
            },
          }, {
            new: true
          }, (err, updatedGame) => {
            if (err) {
              reject(err);
              return;
            }
            resolve(updatedGame);
          }
        )
      });
  });
}

function fish(game, query) {
  const {cats: {fishercat: {count: fishercats}}} = game;
  let caughtCatfish = 0, caughtSalmon = 0;
  for (let i=0; i < fishercats; i++) {
    const chance = Math.random();
    if (chance < 0.05) {
      caughtSalmon += 1;
      continue;
    }

    if (chance < 0.25) {
      caughtCatfish += 1;
    }
  }

  return query.findOneAndUpdate({
      uuid: game.uuid,
    },{
      $inc: {
        'resources.catfish': caughtCatfish,
        'resources.salmon': caughtSalmon
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
  assignJob,
  createCats,
  fish
};

module.exports = GameApi;
