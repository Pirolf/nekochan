const React = require('react');
const serialize = require('form-serialize');

const SocketClient = require('./socket_client');

const submit = (e) => {
  e.preventDefault();
  const formData = serialize(e.target, {hash: true});
  SocketClient.assignJob(formData);
}

const assignJobForm = () => {
  return (
    <form onSubmit={submit}>
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
  )
}

module.exports = assignJobForm;
