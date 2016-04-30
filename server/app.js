const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const path = require('path');

const rootPath = path.resolve(path.dirname(process.mainModule.filename), '../');

app.get('/', (req, res) => {
  	res.sendFile(path.join(rootPath, '/views/index.html'));
});

io.on('connection', (socket) => {
	console.log('a user connected');
	socket.on('disconnect', () => {
		console.log('a user disconnected');
	});
});

http.listen(3000, () => {
  console.log('listening on *:3000');
});