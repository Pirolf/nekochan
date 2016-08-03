const mongoose = require('mongoose');

const map = require('./game_map');
const numberType = { type: Number, default: 0, min: 0 };
const gameSchema = mongoose.Schema({
    users: [String], //users' fb ids
    uuid: String,
    cats: {
    	noProfession: {
    		count: { type: Number, default: 3, min: 0 },
    	},
      explorer: {
        count: numberType,
        locations: {
          name: String,
          count: numberType
        },
      },
      fishercat: {
        count: numberType,
      },
      starved: numberType,
    },
    map: map,
    resources: {
      catfish: { type: Number, default: 10, min: 0 },
    	salmon: numberType,
    },
    updated: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Game', gameSchema);
