const mongoose = require('mongoose');
const TripSchema = mongoose.Schema({
  origin: String,
  destination: String,
  count: { type: Number, default: 0, min: 0 },
  remaining: { type: Number, default: 0, min: 0 }
});

module.exports = TripSchema;
