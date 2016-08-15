const mongoose = require('mongoose');

const LocationSchema = require('./location');
const TripSchema = require('./trip');

const numberType = { type: Number, default: 0, min: 0 };

const GameSchema = mongoose.Schema({
    users: [String], //users' fb ids
    uuid: String,
    cats: {
    	noProfession: {
    		count: { type: Number, default: 3, min: 0 },
    	},
      explorer: {
        count: numberType, //TODO: remove.
        attributes: {
          speed: { type: Number, default: 50, min: 0 }
        },
        trips: [TripSchema],
        locations: [LocationSchema]
      },
      fishercat: {
        count: numberType,
      },
      starved: numberType,
    },
    map: {},
    resources: {
      catfish: { type: Number, default: 10, min: 0 },
    	salmon: numberType,
    },
    updated: { type: Date, default: Date.now }
});

GameSchema.methods.distance = function(src, dest) {
  const coords1 = this.map[src].coords;
  const coords2 = this.map[dest].coords;
  return Math.sqrt(coords2.reduce((memo, v, i) => {
    return memo + Math.pow(v - coords1[i], 2)
  }, 0));
};

GameSchema.methods.arePlacesValid = function(...places) {
  return places.every(p => this.map[p]);
};

module.exports = mongoose.model('Game', GameSchema);
