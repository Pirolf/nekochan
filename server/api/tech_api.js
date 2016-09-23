const Game = require('../models/game');
const TechTree = require('../tech_tree');

function useResources({gameResources = {}, requiredResources}, cb) {
  return Object.keys(requiredResources).reduce((memo, k) => {
    memo[k] = gameResources[k] - requiredResources[k];
    if (!gameResources[k] || memo[k] < 0) return cb();
    return memo;
  }, {});
}

function research(uuid, {name}) {
  return new Promise((resolve, reject) => {
    return Game.findOne({uuid}).exec().then((game) => {
      const gameTech = game.tech || {};
      const gameResources = game.resources || {};

      const techTree = TechTree.get();
      const tech = techTree[name];
      if (!tech) return reject('no such tech');
      if (gameTech[name]) return reject(`already researched ${name}`);

      const {prereqs = {}, resources = {research: {}}} = tech;
      const prereqsMet = Object.keys(prereqs).every(k => gameTech[k] && (gameTech[k].level >= prereqs[k].level)); 
      if (!prereqsMet) return reject('research prereqs not met'); 

      const setResources = useResources({gameResources, requiredResources: resources.research}, () => reject('not enough resources'));    
      return Game.findOneAndUpdate({uuid: game.uuid}, {
        $set: {
          tech: {...gameTech, [name]: {level: 0}},
          resources: {...gameResources, ...setResources}
        }
      }, {new: true}).exec().then(resolve, reject);
    });
  });
}

function upgrade(uuid, {name}){
  return new Promise((resolve, reject) => {
    return Game.findOne({uuid}).exec().then((game) => {
      const gameTech = game.tech || {};
      const gameResources = game.resources || {};

      const techTree = TechTree.get();
      const tech = techTree[name];

      if (!tech) return reject('no such tech');
      if (!gameTech[name]) return reject('cannot upgrade before researching');

      const level = gameTech[name].level + 1;
      if (!tech.resources.upgrade[level]) return reject('not upgradable');

      const {resources: {upgrade = {}}} = tech;
      const setResources = useResources({gameResources, requiredResources: upgrade[level]}, () => reject('not enough resources'));    
      const techKey = `tech.${name}`;
      return Game.findOneAndUpdate({uuid: game.uuid}, {
        $set: {
          resources: {...gameResources, ...setResources},
          tech: {...gameTech, [name]: {level: level}},
        }
      }, {new: true}).exec().then(resolve, reject);
    });
  });
}

module.exports = {
  research,
  upgrade
};
