const fs = require('fs');
function nodeModules(){
    const modules = {};
    fs.readdirSync('node_modules')
        .filter((x) => {
            return ['.bin'].indexOf(x) === -1;
        })
        .forEach((mod) => {
            modules[mod] = 'commonjs ' + mod;    
        });
    return modules;
}
const modules = nodeModules();
module.exports = {
    target: "node",
    entry: ['./server/app.js'],
    module: {
        loaders: [{ 
            test: /\.js/, 
            include: /server/,
            loader: 'babel',
            query: {
                presets: ['es2015', 'stage-0', 'stage-1', 'stage-2', 'stage-3'],
                plugins: ['transform-runtime', 'syntax-async-functions']
            }
        }, 
        { test: /\.json$/, loader: 'json-loader' }]
    },
    externals: modules,
    output: {
        filename: 'bundle.js'
    }
}