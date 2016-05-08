const Habitat = require('habitat');
const path = require('path');
const rootPath = path.resolve(path.dirname(process.mainModule.filename), '../');

function getEnv(){
	Habitat.load(path.join(rootPath, '.env'));
	return new Habitat();
}

module.exports = {
	rootPath,
	env: getEnv()
};