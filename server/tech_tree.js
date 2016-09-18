const techTree = {
  fishing: {
    resources: {
      develop: {
        wood: 80
      },
      upgrade: {
        2: {
          wood: 20
        },
        3: {
          wood: 30
        }
      }
    },
    prereqs: {
    }
  },
  fishFarm: {
    resources: {
      develop: {
        salmon: 100
      }
    },
    prereqs: {
      fishing: {
        level: 3
      }
    }
  }
};

module.exports = {
  get: () => techTree
}; 
