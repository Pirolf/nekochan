const Game = require('./game');
const CatsFactory = require('./factories/cats_factory');

const catProfessions = ['noProfession', 'explorer'];
const Promise = require('es6-promise').Promise;

function createCats(uuid, {catsToCreate}) {
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

function fish(game) {
  const {resources, cats: {fishercat: {count: fishercats}}} = game;
  const fisherCat = CatsFactory.makeFishercat(fishercats);
  const updatedResources = fisherCat.fish(resources);
  game.resources = updatedResources;
}

function consumeResources(game) {
  const {
    noProfession: {count: idleCount},
    fishercat: {count: fishercatCount},
    explorer: {count: explorerCount}
  } = game.cats;

  const cats = CatsFactory.makeCats({explorer: explorerCount, fishercat: fishercatCount, noProfession: idleCount});

  let leftFood = game.resources;
  Object.values(cats).forEach((cat) => {
    leftFood = cat.eat(leftFood);
  });

  game.resources = leftFood;
  ['noProfession', 'fishercat', 'explorer'].forEach((k) => {
    game.cats[k].count = cats[k].count;
  });
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
  consumeResources,
  createCats,
  fish,
};

module.exports = GameApi;
