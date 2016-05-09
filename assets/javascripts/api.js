const $ = require("jquery");
const api = {
	createGame: () => {
		$.ajax({
			url: '/create-game',
			method: 'POST'
		}).done(() => {
			console.log('success');
		});
	}
};

module.exports = api;