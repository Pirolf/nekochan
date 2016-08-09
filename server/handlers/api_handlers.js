const Game = require('../models/game');
const uuid = require('uuid');

async function createGame(req, res) {
  const MapConfig = require('../map_config');
  const toPairs = require('lodash.topairs');
  return Game.create({
      uuid: uuid.v4(),
      users: [req.user.facebook.id],
      'cats.explorer.locations': toPairs(MapConfig.getConfig()).filter(([,{type}]) => type === 'base').map(([k]) => ({name: k, explorerCount: 0})),
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
}
