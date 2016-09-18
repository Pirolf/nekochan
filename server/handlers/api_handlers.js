const Game = require('../models/game');
const uuid = require('uuid');

const GameMap = require('../models/game_map');
const MapConfig = require('../map_config');

function loadMap() {
  const toPairs = require('lodash.topairs');
  return toPairs(GameMap.get())
    .filter(([name, v]) => MapConfig.get()[name].type === 'base')
    .reduce((memo, [name, v]) => {
      memo[name] = v;
      return memo;
    }, {});
}

async function createGame(req, res) {
  const toPairs = require('lodash.topairs');
  return Game.create({
      uuid: uuid.v4(),
      users: [req.user.facebook.id],
      map: loadMap(),
      'cats.explorer.locations': toPairs(MapConfig.get()).filter(([,{type}]) => type === 'base').map(([k]) => ({name: k, explorerCount: 0})),
    })
    .then(savedGame => {
      console.log(`Create game: ${savedGame.uuid}`);
      res.send({uuid: savedGame.uuid});
    }, e => console.log(e));
}

async function getGame(req, res) {
  return Game.findOne({ 'uuid' : req.params.uuid }).exec()
    .then(game => res.send(game), err => res.sendStatus(422));
}

module.exports = {
  createGame,
  getGame
};
