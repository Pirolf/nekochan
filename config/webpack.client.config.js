module.exports = {
    node: {
      fs: "empty",
      net: "empty",
      tls: "empty"
    },
    module: {
        loaders: [{
            test: /\.js/,
            loader: 'babel',
            exclude: /node_modules/,
            query: {
                presets: ['es2015', 'react', 'stage-0', 'stage-1', 'stage-2', 'stage-3'],
                plugins: ['transform-runtime', 'syntax-async-functions']
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
