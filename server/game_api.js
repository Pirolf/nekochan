let gameState = "stopped";

function update() {
	const date = new Date(Date.now())
	console.log(date.toString());
}

async function run() {
	return new Promise((resolve, reject) => {
		update();
		setTimeout(() => resolve(), 3000);
	});
}

const GameApi = {
	start: async () => {
		gameState = "running";
		while (gameState === "running") {
			await run();
		}
	},

	stop: () => {
		gameState = "stopped";
	}
};

module.exports = GameApi;