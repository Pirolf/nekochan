const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const path = require('path');
const mongoose = require('mongoose');
const passport = require('passport');
const session = require('express-session');
const config = require('../config/config');
const {env, rootPath} = require('./helper');

require('./auth')(passport);

mongoose.connect(config.db.url);
app.get('/', (req, res) => {
  	res.sendFile(path.join(rootPath, '/views/index.html'));
});

app.get('/sign-in', (req, res) => {
	res.sendFile(path.join(rootPath, '/views/sign-in.html'));
});

let userIds = [];
/*eslint-disable no-console */
io.on('connection', (socket) => {
	console.log('a user connected');
	userIds.push(userIds.length);
	const room = userIds.length % 2 === 1? 'room-0' : 'room-1';

	socket.join(room, () => {
		console.log(`joined ${room}`);	
	});

	socket.on('cat', (msg) => {
		io.to(room).emit('cat', `biuuuu ${room}`);
    	console.log('cat ' + msg);
  	});

	socket.on('disconnect', () => {
		console.log('a user disconnected');
	});
});

app.use(express.static('public'));

app.use(session({ secret: env.get('SESSION_SECRET') }));
app.use(passport.initialize());
app.use(passport.session());

app.get('/auth/facebook', passport.authenticate('facebook', { scope : 'email' }));

app.get('/auth/facebook/callback', passport.authenticate('facebook', {
    successRedirect : '/nekos',
    failureRedirect : '/'
}));

app.get('/nekos', isLoggedIn, (req, res) => {
    res.sendFile(path.join(rootPath, '/views/auth_test.html'));
});

app.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/');
});

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) return next();
    res.redirect('/');
}

http.listen(3000, () => {
	console.log('listening on *:3000');
});
/*eslint-enable no-console */