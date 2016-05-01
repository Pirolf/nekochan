module.exports = {
    config: (nodeModules) => {
        return {
            target: "node",
            entry: ['./server/app.js'],
            module: {
                loaders: [{ 
                    test: /\.js/, 
                    include: /server/,
                    loader: 'babel',
                    query: {
                        presets: ['es2015', 'stage-0', 'stage-1']
                    }
                }, 
                { test: /\.json$/, loader: 'json-loader' }]
            },
            externals: [nodeModules],
            output: {
                filename: 'bundle.js'
            }
        };
    }
}