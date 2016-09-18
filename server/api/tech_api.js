const Game = require('../models/game');
const TechTree = require('../tech_tree');

function research(uuid, {name}) {
  return new Promise((resolve, reject) => {
    return Game.findOne({uuid}).exec().then((game) => {
      const gameTech = game.tech || {};
      const gameResources = game.resources || {};

      const techTree = TechTree.get();
      const tech = techTree[name];
      if (!tech) return reject('no such tech');
      if (gameTech[name]) return reject(`already researched ${name}`);

      const {prereqs = {}, resources = {}} = tech;
      const prereqsMet = Object.keys(prereqs).every(k => gameTech[k] && (gameTech[k].level >= prereqs[k].level)); 
      if (!prereqsMet) return reject('research prereqs not met'); 

      const setResources = Object.keys(resources).reduce((memo, k) => {
        memo[k] = gameResources[k] - resources[k];
        if (!gameResources[k] || memo[k] < 0) return reject('not enough resources');
        return memo;
      }, {});

      return Game.findOneAndUpdate({uuid: game.uuid}, {
        $set: {
          tech: {...gameTech, [name]: {level: 0}},
          resources: {...gameResources, ...setResources}
        }
      }, {new: true}).exec().then(resolve, reject);
    });
  });
}

module.exports = {
  research
};
