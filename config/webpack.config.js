module.exports = {
    watch: true,
    //socket.io-client depends on ws, breaks
    noParse: ['ws'],
    node: {
      fs: "empty",
      net: "empty"
    },
    module: {
        loaders: [{ 
            test: /\.js/, 
            exclude: /node_modules/, 
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
    externals: ['ws'],
    output: {
        filename: 'bundle.js'
    }
};