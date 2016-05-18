const React = require('react');
const ReactDOM = require('react-dom');
const Game = require('./game');
const Api = require('./api');
const {Actions} = require('p-flux');
const useStore = require('p-flux').useStore;
const store = require('./store');
const getRoute = require('./helpers/route_helper');

class Application extends React.Component {
	static propTypes = {
    	store: React.PropTypes.object.isRequired
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
		const {store: {user, game}} = this.props;
		return (
			<div className="app">
				<button onClick={this.newGame}>New Game</button>
				{user && game && <Game {...{user, game}}/>} 
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