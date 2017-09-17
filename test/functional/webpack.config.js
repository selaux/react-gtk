const path = require('path');
const webpack = require('webpack');

module.exports = {
    entry: {
        events: path.resolve(__dirname, 'apps/events.js'),
        inputs: path.resolve(__dirname, 'apps/inputs.js')
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /(node_modules|bower_components)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: [ 'es2015' ]
                    }
                }
            }
        ]
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: process.env.NODE_ENV,
                DEBUG_REACT_GTK: '1'
            }
        })
    ],
    output: {
        path: path.resolve(__dirname, '../../test-output/functional'),
        filename: '[name]Bundle.js'
    }
};
