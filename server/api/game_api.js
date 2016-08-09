const Game = require('../models/game');
const CatsFactory = require('../factories/cats_factory');
const {stringToInt} = require('../helpers/math_helper');

const catProfessions = ['noProfession', 'explorer'];

function createCats(uuid, {catsToCreate}) {
  Game.findOne({uuid}, (err, game) => {
    if (err) {
      reject(new Error("game not found"));
      return;
    }
    const {resources: {catfish}} = game;
    if (catfish < 10 * catsToCreate) {
      reject(new Error("not enough cat fish"));
      return;
    }

    Game.findOneAndUpdate({uuid}, {
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
      Game.findOne({uuid}, (err, game) => {
        if (err) {
          reject(new Error("game not found"));
          return;
        }
        const {resources: {catfish}} = game;
        if (catfish < 10 * catsToCreate) {
          reject(new Error("not enough cat fish"));
          return;
        }

        Game.findOneAndUpdate({uuid}, {
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

function travel(uuid, {src, dest, travellerCount}) {
  const {number: count, ok} = stringToInt(travellerCount);
  if (!ok) return Promise.reject(new Error('bad request'));
  //TODO: use mongo query if possible
  return Game.findOne({uuid}).exec().then(game => {
    const MapConfig = require('../map_config');
    const toPairs = require('lodash.topairs');
    const resourceUpdates = toPairs(MapConfig.getConfig()[dest].requirements).reduce((memo, [k, v]) => {
      memo[k] = game.resources[k] - v * count;
      return memo;
    }, {});
    const requirementsMet = Object.values(resourceUpdates).every(v => v >= 0);
    if (!requirementsMet) {
      return Promise.resolve({requirementsNotMet: true});
    }
    const locationUpdates = game.cats.explorer.locations.map(({name, explorerCount}) => {
      switch (name) {
        case src:
          return {name, explorerCount: explorerCount - count};
        case dest:
          return {name, explorerCount: explorerCount + count};
        default:
          return {name, explorerCount};
      }
    });
    return Game.findOneAndUpdate({uuid}, {resources: resourceUpdates, 'cats.explorer.locations': locationUpdates}, {new: true}).exec();
  }, err => {
    return Promise.reject(err);
  });
}

function assignJob(gameUUID, {number, currentJob, newJob}) {
  const currentJobKey = `cats.${currentJob}.count`;
  const {number: count, ok} = stringToInt(number);
  if (!ok) return Promise.reject(new Error('bad request'));

  if (count <= 0) {
    return Promise.reject(new Error('can only select a positive number of cats'));
  }

  return Game.findOne({uuid: gameUUID, [currentJobKey]: { $gte: number }}).exec()
  .then((game) => {
    game.cats[currentJob].count -= count;
    game.cats[newJob].count += count;
    if (currentJob === 'explorer') {
      const oldLocations = game.cats[currentJob].locations;
      const base = oldLocations.find(l => l.name === 'base');
      game.cats[currentJob].locations = oldLocations.filter(l => l.name !== 'base').concat([{name: base.name, explorerCount: base.explorerCount - number}]);
    }
    if (newJob === 'explorer') {
      const oldLocations = game.cats[newJob].locations;
      const base = oldLocations.find(l => l.name === 'base');
      game.cats[newJob].locations = oldLocations.filter(l => l.name !== 'base').concat({name: base.name, explorerCount: base.explorerCount + number});
    }
    return game.save().then(g => Promise.resolve(g), e => Promise.reject(e));
  }, (err) => {
    return Promise.reject(err);
  });
}

const GameApi = {
  assignJob,
  consumeResources,
  createCats,
  fish,
  travel
};

module.exports = GameApi;
