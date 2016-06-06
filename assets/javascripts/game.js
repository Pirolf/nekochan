const React = require('react');
const SocketClient = require('./socket_client');

const serialize = require('form-serialize');

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

	submit = (e) => {
    e.preventDefault();
    const formData = serialize(e.target, {hash: true});
    console.log(formData);
    SocketClient.assignJob(formData);
  }

	render() {
		const {game} = this.props;
		return (
			<div className="game">
				Game Area
				<div className="game-data">
					{JSON.stringify(game)}
				</div>
				<form onSubmit={this.submit}>
					<div className="unassigned-cats">
						<span>idle cats</span>
						<span>{game.cats.noProfession.count}</span>
					</div>
					<input type="number" name="number" defaultValue="0"/>
					<select name="newJob">
						<option value="explorer">Explorer</option>
						<option value="fishercat">Fishercat</option>
					</select>
          <input type="hidden" name="currentJob" defaultValue="noProfession"/>
					<input type="submit" defaultValue="submit"/>
				</form>
			</div>
		);
	}
}

module.exports = Game;
