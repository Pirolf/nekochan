const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const path = require('path');

const rootPath = path.resolve(path.dirname(process.mainModule.filename), '../');

app.get('/', (req, res) => {
  	res.sendFile(path.join(rootPath, '/views/index.html'));
});

io.on('connection', (socket) => {
	/*eslint-disable no-console */
	console.log('a user connected');
	/*eslint-enable no-console */
	socket.on('disconnect', () => {
		/*eslint-disable no-console */
		console.log('a user disconnected');
		/*eslint-enable no-console */
	});
});

app.use(express.static('public'));
http.listen(3000, () => {
	/*eslint-disable no-console */
	console.log('listening on *:3000');
	/*eslint-enable no-console */
});