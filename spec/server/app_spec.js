describe('App', () => {
	const {hello} = require('../../server/app');
	it('#hello', () => {
		expect(hello()).toBe(1);
	});
});