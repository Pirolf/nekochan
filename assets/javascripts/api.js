const request = require('request');
const {baseUrl} = require('../../config/config.js');
const urljoin = require('url-join');
const ApiHelper = require('./helpers/api_helper');

function baseRequest() {
  return request.defaults({baseUrl});
}

const Api = {
	createGame: () => {
		return new Promise((resolve, reject) => {
			baseRequest().post({url: '/create-game'}, (err, res, body) => {
        if (ApiHelper.baseReject(reject, err, res.statusCode)) {
          return;
        }
        const {uuid} = JSON.parse(body);
        ApiHelper.redirect(urljoin(baseUrl, 'game', uuid));
        resolve(body);
			});
		});
	},

	getGame: ({uuid}) => {
		return new Promise((resolve, reject) => {
			baseRequest().get(`/get-game/${uuid}`, (err, res, body) => {
        if (ApiHelper.baseReject(reject, err, res.statusCode)) {
          return;
        }
				resolve(JSON.parse(body));
			});
		});
	},

	getUser: () => {
		return new Promise((resolve, reject) => {
			baseRequest().get('/current-user', (err, res, body) => {
        if (ApiHelper.baseReject(reject, err, res.statusCode)) {
          return;
        }
				resolve(JSON.parse(body));
			});
		});
	}
};

module.exports = Api;
