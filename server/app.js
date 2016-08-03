const express = require('express');
const path = require('path');
const passport = require('passport');
const bodyParser = require('body-parser');
const session = require('express-session');
const {env, rootPath} = require('./helper');
const ApiHandlers = require('./handlers/api_handlers');

require('./auth')(passport);

module.exports = function() {
  const app = express();

  app.use(express.static(path.join(rootPath, 'public')));
  app.use('/game', express.static(path.join(rootPath, 'public')));
  app.use(bodyParser());
  app.use(session({ name: 'neko-auth', secret: env.get('SESSION_SECRET') }));
  app.use(passport.initialize());
  app.use(passport.session());

  const viewPath = path.join(rootPath, "views");

  app.get('/', isLoggedIn, (req, res) => {
    	res.sendFile(path.join(viewPath, 'index.html'));
  });

  app.get('/sign-in', (req, res) => {
  	res.sendFile(path.join(viewPath, 'sign-in.html'));
  });

  app.get('/auth/facebook', passport.authenticate('facebook', { scope : 'email' }));

  app.get('/auth/facebook/callback', passport.authenticate('facebook', {
      failureRedirect : '/sign-in'
  }), (req, res) => {
  	res.redirect('/');
  });

  app.get('/nekos', isLoggedIn, (req, res) => {
      res.sendFile(path.join(rootPath, '/views/auth_test.html'));
  });

  app.get('/logout', (req, res) => {
      req.logout();
      res.redirect('/sign-in');
  });

  app.get('/current-user', (req, res) => {
  	if (!req.isAuthenticated) {
  		res.sendStatus(401);
  		return;
  	}
  	const {facebook: {name, id, token}} = req.user;
  	res.send({name, id, token, auth_method: "facebook"});
  });

  /*eslint-disable no-console */
  app.get('/game/:uuid', isLoggedIn, (req, res) => {
  	const Game = require('./game');
  	Game.findOne({uuid: req.params.uuid}, (err, game) => {
  		const userId = req.user.facebook.id;
  		console.log(game.users)
  		const includes = require('lodash.includes');
  		if (!includes(game.users, userId)) {
  			game.users.push(userId);
  			game.save((err) => {
  				if (err) throw err;
  				res.sendFile(path.join(viewPath, 'index.html'));
  				return;
  			});
  		}
  		res.sendFile(path.join(viewPath, 'index.html'));
  	});
  });

  app.get('/get-game/:uuid', isLoggedIn, ApiHandlers.getGame);

  app.post('/create-game', isLoggedIn, ApiHandlers.createGame);

  app.get('/test', (req, res) => {
      console.log('test');
      res.send("miao")
  });

  function isLoggedIn(req, res, next) {
      if (req.isAuthenticated()) return next();
      res.redirect('/sign-in');
  }

  return app;
}
/*eslint-enable no-console */
