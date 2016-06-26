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
    const {noProfession: {count: idleCats}, fishercat: {count: fisherCats}, explorer: {count: explorers}} = game.cats;

		return (
			<div className="game">
				Game Area
				<div className="game-data">
					{JSON.stringify(game)}
				</div>
        <div className="presenter">
          <h2>Kitty Status</h2>
          <div className="cat-row">
            <span className="cat-count">{explorers}</span><span>kitties</span><span className="cat-action">Exploring</span>
          </div>
          <div className="cat-row">
            <span className="cat-count">{fisherCats}</span><span>kitties</span><span className="cat-action">Fishing</span>
          </div>
          <div className="cat-row">
            <span className="cat-count">{idleCats}</span><span>kitties</span><span className="cat-action">Doing nothing</span>
          </div>
        </div>
				<form onSubmit={this.submit}>
          <span>Make</span>
					<input type="number" name="number" defaultValue="0"/>
          <select name="currentJob">
            <option value="noProfession">Idle</option>
            <option value="explorer">Explorer</option>
            <option value="fishercat">Fishercat</option>
          </select>
          <span>kitties</span>
          <select name="newJob">
            <option value="noProfession">Do nothing</option>
						<option value="explorer">Explorers</option>
						<option value="fishercat">Fishercats</option>
					</select>
					<input type="submit" defaultValue="update"/>
				</form>
			</div>
		);
	}
}

module.exports = Game;
