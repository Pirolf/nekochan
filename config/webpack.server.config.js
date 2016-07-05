const nodeExternals = require('webpack-node-externals');
module.exports = {
    target: "node",
    entry: ['./server/cluster.js'],
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
    externals: [nodeExternals()],
    output: {
        filename: 'bundle.js'
    }
}
