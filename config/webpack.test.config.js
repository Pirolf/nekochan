const nodeExternals = require('webpack-node-externals');
module.exports = {
    target: 'node',
    module: {
        loaders: [{
            test: /\.js/,
            loader: 'babel',
            query: {
                presets: ['es2015', 'react', 'stage-0', 'stage-1', 'stage-2', 'stage-3'],
                plugins: ['transform-runtime', 'syntax-async-functions']
            }
        },
        { test: /\.json$/, loader: 'json-loader' }]
    },
    externals: [nodeExternals()],
    output: {
        filename: 'server-spec.js'
    }
}
