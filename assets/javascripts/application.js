const React = require('react');
const ReactDOM = require('react-dom');
const client = require('./client');

class Application extends React.Component {
	click = () => {
		client.meow();
	};

	render() {
		return (
			<div className="app biu">
				<div>miao</div>
				<input type="submit" value="click me" onClick={this.click}/>
			</div>
		);
	}
}

ReactDOM.render(<Application />, document.getElementById('root'));
module.exports = Application;