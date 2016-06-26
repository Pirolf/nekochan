const mongoose = require('mongoose');

const gameSchema = mongoose.Schema({
    users: [String], //users' fb ids
    uuid: String,
    cats: {
    	noProfession: {
    		count: { type: Number, default: 3 }
    	},
      explorer: {
          count: { type: Number, default: 0 }
      },
      fishercat: {
        count: { type: Number, default: 0 }
      }
    },
    resources: {
    	salmon: { type: Number, default: 10 }
    },
    updated: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Game', gameSchema);
