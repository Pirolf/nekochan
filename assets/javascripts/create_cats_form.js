const React = require('react');
const serialize = require('form-serialize');

const SocketClient = require('./socket_client');

const submit = (e) => {
  e.preventDefault();
  const formData = serialize(e.target, {hash: true});
  SocketClient.createCats(formData);
}

function createCatsForm() {
  return (
    <form onSubmit={submit}>
      <span>Create</span>
      <input type='number' name='catsToCreate' defaultValue='0'/>
      <span>kitties</span>
      <input type='submit' value='create'/>
    </form>
  )
}

module.exports = createCatsForm;
