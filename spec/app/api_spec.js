require('../spec_helper');

describe('Api', () => {
  const request = require('request');
  const {baseUrl} = require('../../config/config');
  const Api = require('../../assets/javascripts/api');
  const ApiHelper = require('../../assets/javascripts/helpers/api_helper');

  describe('#createGame', () => {
    let redirectSpy, rejectSpy;
    beforeEach(() => {
      spyOn(request, 'defaults').and.returnValue(request);
      spyOn(request, 'post').and.callFake((opts, cb) => {
        cb(null, {statusCode: 200}, JSON.stringify({uuid: 'abc123'}));
      });
      redirectSpy = spyOn(ApiHelper, 'redirect');
      rejectSpy = spyOn(ApiHelper, 'baseReject');
      Api.createGame();
    });

    it('post with correct url', () => {
      expect(request.post).toHaveBeenCalledWith({url: '/create-game'}, jasmine.any(Function));
    });

    it('tries to reject on error', () => {
      expect(rejectSpy).toHaveBeenCalledWith(jasmine.any(Function), null, 200);
    });

    it('redirects to the game page', () => {
      expect(redirectSpy).toHaveBeenCalledWith(`${baseUrl}/game/abc123`);
    });
  });
});
