describe('App endpoints', () => {
  const request = require('request');
  it('dummy', (done) => {
    request('http://localhost:4000/test', (err, res, body) => {
      expect(err).toBeNull();
      expect(res.statusCode).toEqual(200);
      expect(body).toEqual("miao");
      done();
    })
  });
});
