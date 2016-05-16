const React = require('react');
const SocketClient = require('./socket_client');

const types = React.PropTypes;
class Game extends React.Component {
	static propTypes = {
		game: types.object.isRequired,
		user: types.object.isRequired
	}

	componentDidMount() {
		SocketClient.connect();
		const {user, game: {uuid: gameUUID}} = this.props;
		SocketClient.authenticate({user, gameUUID});
	}

	render() {
		return <div>Game Area</div>;
	}
}

module.exports = Game;