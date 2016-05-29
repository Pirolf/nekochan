const catProfessions = ['noProfession', 'explorer'];
function generateCats(game) {
	const {cats} = game;
	const totalCats = catProfessions.map(profession => cats[profession].count).reduce((prev, current) => {
		return prev + current;
	}, 0);

	const salmons = game.resources.salmon;
	if (salmons / totalCats > 1.5) {
		const newCats = Math.floor((salmons - totalCats) / 2);
		game.cats.noProfession.count = cats.noProfession.count + newCats;
		game.resources.salmon = salmons - newCats * 2;
	}
	return game;
}

const GameApi = {
	generateCats
};

module.exports = GameApi;