const io = require('socket.io-client/socket.io.js');
const socket = io();

socket.on('cat', (msg) => {	
	alert(msg);
});

const Client = {
	meow: () => {
		socket.emit('cat', "meow");
	}
};

module.exports = Client;