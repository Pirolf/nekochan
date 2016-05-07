const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const path = require('path');

const rootPath = path.resolve(path.dirname(process.mainModule.filename), '../');

app.get('/', (req, res) => {
  	res.sendFile(path.join(rootPath, '/views/index.html'));
});

let userIds = [];
io.on('connection', (socket) => {
	/*eslint-disable no-console */
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
	/*eslint-enable no-console */
});

app.use(express.static('public'));
http.listen(3000, () => {
	/*eslint-disable no-console */
	console.log('listening on *:3000');
	/*eslint-enable no-console */
});