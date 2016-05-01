const React = require('react');
const ReactDOM = require('react-dom');

class Application extends React.Component {
	render() {
		return (<div className="app"></div>);
	}
}

ReactDOM.render(
	<Application />,
	document.getElementById('root')
);
module.exports = Application;