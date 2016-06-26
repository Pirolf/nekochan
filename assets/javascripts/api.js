const request = require('ajax-request');
const api = {
	createGame: () => {
		return new Promise((resolve, reject) => {
			request({url: '/create-game', method: 'POST'}, (err, res, body) => {
				if (err) {
					reject(err);
					return;
				}
				resolve(body);
			});
		});
	},

	getGame: ({uuid}) => {
		return new Promise((resolve, reject) => {
			request({url: `/get-game/${uuid}`, method: 'GET'}, (err, res, body) => {
				if (err) {
					reject(err);
					return;
				}
				resolve(JSON.parse(body));
			});
		});
	},

	getUser: () => {
		return new Promise((resolve, reject) => {
			request({url: '/current-user', method: 'GET'}, (err, res, body) => {
				if (err) {
					reject(err);
					return;
				}
				resolve(JSON.parse(body));
			});
		});
	}
};

module.exports = api;
