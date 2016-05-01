module.exports = {
    config: (nodeModules) => {
        return {
            node: {
              fs: "empty",
              net: "empty"
            },
            module: {
                loaders: [{ 
                    test: /\.js/, 
                    //include: ['./assets/javascripts/hello.js'],
                    //exclude: ["./node_modules"], 
                    loader: 'babel',
                    query: {
                        presets: ['es2015', 'stage-0', 'stage-1']
                    }
                }, 
                { test: /\.json$/, loader: 'json-loader' },
                {
                    test: /\.scss$/,
                    loaders: ["style", "css", "sass"]
                }]
            },
            //externals: [nodeModules],
            output: {
                filename: 'bundle.js'
            }
        };
    }
}