const path = require('path');
const webpack = require('webpack');


module.exports = {
    devtool: 'eval',
    entry: [
        'babel-polyfill',
        './src/index'
    ],
    node: {
        fs: 'empty'
    },
    output: {
        path: path.join(__dirname, 'dist'),
        filename: 'bundle.js',
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                include: [path.resolve(__dirname, './src')],
                use: [
                    {loader: 'react-hot-loader'},
                    {
                        loader: 'babel-loader',
                        query: {cacheDirectory: true}
                    }
                ]
            },
            {
                test: /\.(jpe?g|png|gif|svg|ttf|eot)$/i,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            name: '[name].[ext]'
                        }
                    }
                ]
            },
            {test: /\.s?css$/, loaders: ['style-loader', 'css-loader', 'sass-loader', 'postcss-loader']}
        ]
    },
    plugins: [
        new webpack.optimize.OccurrenceOrderPlugin(),
        new webpack.NoEmitOnErrorsPlugin(),
        new webpack.optimize.UglifyJsPlugin({
            mangle: true,
            compress: {
                warnings: false, // Suppress uglification warnings
                pure_getters: true,
                unsafe: true,
                unsafe_comps: true,
                screw_ie8: true,
                drop_console: false
            },
            output: {
                comments: false,
            },
            exclude: [/\.min\.js$/gi] // skip pre-minified libs
        }),
    ]
};