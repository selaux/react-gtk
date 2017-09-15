const path = require('path');
const webpack = require('webpack');

module.exports = {
    entry: {
        events: path.resolve(__dirname, 'apps/events.js')
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env': {
                'NODE_ENV': process.env.NODE_ENV
            }
        })
    ],
    output: {
        path: path.resolve(__dirname, '../../test-output/functional'),
        filename: '[name]Bundle.js'
    }
};