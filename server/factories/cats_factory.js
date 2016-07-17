const ExplorerCat = require('../cats/explorer_cat');
const FisherCat = require('../cats/fisher_cat');
const IdleCat = require('../cats/idle_cat');

const CatsFactory = {
  makeCats: ({noProfession: i, fishercat: f, explorer: e }) => {
    return {
      noProfession: new IdleCat(i),
      fishercat: new FisherCat(f),
      explorer: new ExplorerCat(e),
    };
  },
  makeFishercat: (count) => {
    return new FisherCat(count);
  }
};
module.exports = CatsFactory;
