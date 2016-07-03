const React = require('react');
const SocketClient = require('./socket_client');
const AssignJobForm = require('./assign_job_form');
const CreateCatsForm = require('./create_cats_form');
const Error = require('./error');
const {extractError} = require('./helpers/error_helper');

const types = React.PropTypes;
class Game extends React.Component {
	static propTypes = {
		game: types.object.isRequired,
		user: types.object.isRequired,
		errors: types.object.isRequired
	}

	componentDidMount() {
		SocketClient.connect();
		const {user, game: {uuid: gameUUID}} = this.props;
		SocketClient.authenticate({user, gameUUID});
	}

	render() {
		const {game, errors} = this.props;
    const {noProfession: {count: idleCats}, fishercat: {count: fisherCats}, explorer: {count: explorers}} = game.cats;
    const {resources: {salmon, catfish}} = game;
    const assignJobErrors = extractError("assign-job", errors);
    const createCatsErrors = extractError("create-cats", errors);

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
          <h2>Resources</h2>
          <div className="resource-row">
            <span className="fish">{catfish}</span><span>Catfish</span>
          </div>
          <div className="resource-row">
            <span className="fish">{salmon}</span><span>Salmons</span>
          </div>
        </div>
				<Error errors={assignJobErrors} />
        <AssignJobForm />
        <Error errors={createCatsErrors} />
        <CreateCatsForm />
			</div>
		);
	}
}

module.exports = Game;
