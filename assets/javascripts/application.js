const React = require('react');
const ReactDOM = require('react-dom');
const client = require('./client');
const Api = require('./api');
const {Actions} = require('p-flux');
const useStore = require('p-flux').useStore;
const store = require('./store');
const getRoute = require('./helpers/route_helper');

class Application extends React.Component {
	static propTypes = {
    	store: React.PropTypes.object.isRequired
  	};

	meow = () => {
		client.meow();
	};

	newGame = async () => {
		await Api.createGame();
	};

	async componentDidMount() {
		const user = await Api.getUser();
		Actions.updateUser(user);
		
		const {routeName, pathParams} = getRoute();
		if (routeName === 'game') {
			const game = await Api.getGame({uuid: pathParams[1]});
			Actions.updateGame(game);
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
const ApplicationWithStore = useStore(Application, {
	store, 
	dispatcherHandlers: [require('./dispatcher')]
});

ReactDOM.render(<ApplicationWithStore />, document.getElementById('root'));

module.exports = ApplicationWithStore;