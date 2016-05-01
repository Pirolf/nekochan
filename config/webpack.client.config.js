module.exports = {
    node: {
      fs: "empty",
      net: "empty"
    },
    module: {
        loaders: [{ 
            test: /\.js/, 
            loader: 'babel',
            exclude: /node_modules/,
            query: {
                presets: ['es2015', 'react', 'stage-0', 'stage-1']
            }
        }, 
        { test: /\.json$/, loader: 'json-loader' },
        {
            test: /\.scss$/,
            loaders: ["style", "css", "sass"]
        }]
    },
    output: {
        filename: 'bundle.js'
    }
}