const mongoose = require('mongoose');
const LocationSchema = mongoose.Schema({
  name: String,
  explorerCount: { type: Number, default: 0, min: 0 }
});

module.exports = LocationSchema;
