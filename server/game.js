const mongoose = require('mongoose');

const gameSchema = mongoose.Schema({
    users: [], //users' fb ids
    uuid: String,
    updated: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Game', gameSchema);