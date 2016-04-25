module.exports = {
    watch: true, 
    module: {
        loaders: [{ 
            test: /\.js/, 
            exclude: /node_modules/, 
            loader: 'babel',
            query: {
                presets: ['es2015', 'stage-0', 'stage-1']
            }
        }, {
            test: /\.scss$/,
            loaders: ["style", "css", "sass"]
        }]
    },
    output: {
        filename: 'bundle.js'
    }
};