const React = require('react');
const serialize = require('form-serialize');

const SocketClient = require('./socket_client');

const submit = (e) => {
  e.preventDefault();
  const formData = serialize(e.target, {hash: true});
  SocketClient.createTrip(formData);
}

function generateSources() {
  const {locations} = this.props;
  return locations.map(({name, explorerCount}) => <option key={name} value={name}>{name} ({explorerCount})</option>);
}

function generateDestinations() {
  const {map} = this.props;
  return Object.keys(map).map(k => <option key={k} value={k}>{k}</option>);
}

class TravelForm extends React.Component {
  static propTypes = {
    map: React.PropTypes.object.isRequired,
    locations: React.PropTypes.array.isRequired
  };

  render() {
    return (
      <form onSubmit={submit}>
        <span>Make</span>
        <input type="number" name="travellerCount" defaultValue="0"/>
        <span>kitty explorers travel from </span>
        <select name='src'>
          {this::generateSources()}
        </select>
        <span>to</span>
        <select name="dest">
          {this::generateDestinations()}
        </select>
        <input type="submit" defaultValue="update"/>
      </form>
    )
  }
}

module.exports = TravelForm;
