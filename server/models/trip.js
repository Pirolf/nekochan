const mongoose = require('mongoose');
const TripSchema = mongoose.Schema({
  count: { type: Number, default: 0, min: 0 },
  origin: String,
  destination: String,
  remaining: { type: Number, default: 0, min: 0 }
});

module.exports = TripSchema;
