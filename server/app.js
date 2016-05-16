const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const path = require('path');
const mongoose = require('mongoose');
const passport = require('passport');
const bodyParser = require('body-parser');
const session = require('express-session');
const config = require('../config/config');
const {env, rootPath} = require('./helper');

require('./auth')(passport);

mongoose.connect(config.db.url);

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

/*eslint-disable no-console */
io.on('connection', (socket) => {
	console.log('a user connected');
	socket.on('authenticate', ({user: {name}, gameUUID}) => {
		socket.join(gameUUID, () => {
			io.to(gameUUID).emit('joinGame', {
				message: `${name} joined the game`, 
				timestamp: Date.now()
			});
		});
	})
	
	socket.on('disconnect', () => {
		console.log('a user disconnected');
	});
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
	const {facebook: {name, id}} = req.user;
	res.send({name, id});
});

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

app.get('/get-game/:uuid', isLoggedIn, (req, res) => {
	const Game = require('./game');
	Game.findOne({ 'uuid' : req.params.uuid }, (err, game) => {
		if (err) res.sendStatus(422);
		res.send(game);
	});
})

app.post('/create-game', isLoggedIn, (req, res) => {
	const Game = require('./game');
	const uuid = require('uuid');
	let game = new Game();
	game.users.push(req.user.facebook.id);
	game.uuid = uuid.v1();
    game.save((err) => {
        if (err) throw err;
    	console.log(`Create game: ${game.uuid}`);
		res.redirect(`/game/${game.uuid}`);
    });
});

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) return next();
    res.redirect('/sign-in');
}

http.listen(3000, () => {
	console.log('listening on *:3000');
});
/*eslint-enable no-console */