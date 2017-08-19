var path = require('path');
var webpack = require('webpack');

module.exports = {
    entry: './health_modules/programEnrolmentDecision.js',
    output: {
        path: path.resolve(__dirname, '../output'),
        filename: 'programEnrolmentDecision.js'
    },
    module: {
        loaders: [
            {
                test: /\.js$/,
                loader: 'babel-loader',
                query: {
                    presets: ['es2015']
                }
            }
        ]
    },
    stats: {
        colors: true
    },
};