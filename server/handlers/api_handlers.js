const Game = require('../models/game');
const uuid = require('uuid');

async function createGame(req, res) {
  let game = new Game();
  game.users.push(req.user.facebook.id);
  game.uuid = uuid.v1();
  game.cats.explorer.locations = [{name: 'base', explorerCount: 0}];
  return game.save().then(savedGame => {
    console.log(`Create game: ${savedGame.uuid}`);
    res.send({uuid: savedGame.uuid});
  }, e => console.log(e))
}

async function getGame(req, res) {
  return Game.findOne({ 'uuid' : req.params.uuid }).exec()
    .then(game => res.send(game), err => res.sendStatus(422));
}

module.exports = {
  createGame,
  getGame
}
