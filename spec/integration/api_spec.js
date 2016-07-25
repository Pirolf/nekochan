describe('hello', () => {
  const request = require('request');
  it('works', (done) => {
    request('http://localhost:4000/test', (err, res, body) => {
      expect(err).toBeNull();
      expect(res.statusCode).toEqual(200);
      expect(body).toEqual("miao");
      done();
    })
  });
});
