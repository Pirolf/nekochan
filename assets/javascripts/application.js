const React = require('react');
const ReactDOM = require('react-dom');
const client = require('./client');
const Api = require('./api');
const getRoute = require('./helpers/route_helper');

class Application extends React.Component {
	meow = () => {
		client.meow();
	};

	newGame = async () => {
		await Api.createGame();
	};

	async componentDidMount() {
		const {routeName, pathParams} = getRoute();
		if (routeName === 'game') {
			const uuid = pathParams[1];
			const game = await Api.getGame({uuid});
			console.log(game);
		}
	}

	render() {
		return (
			<div className="app">
				<div>miao</div>
				<button onClick={this.newGame}>New Game</button>
				<input type="submit" value="test meow" onClick={this.meow}/>
			</div>
		);
	}
}

ReactDOM.render(<Application />, document.getElementById('root'));
module.exports = Application;