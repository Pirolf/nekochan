describe('GameApi', () => {
	const GameApi = require('../../server/game_api');
	describe("#generateCats", () => {
		let game = {
			cats: {
				noProfession: {
					count: 1
				},
				explorer: {
					count: 4
				}
			},
			resources: {
				salmon: 12
			}
		};

		describe("when salmon to cats ratio > 1.5", () => {
			beforeEach(() => {
				game = GameApi.generateCats(game);
			});

			it("generates cats of no profession with 2 salmons for each", () => {
				expect(game.cats.noProfession.count).toBe(4);
				expect(game.resources.salmon).toBe(6);	
			});
		});
	});
});