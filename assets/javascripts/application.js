const React = require('react');
const ReactDOM = require('react-dom');
const client = require('./client');
const Api = require('./api');

class Application extends React.Component {
	meow = () => {
		client.meow();
	};

	newGame = () => {
		Api.createGame();
	};

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