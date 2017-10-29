var webpack = require('webpack');
var path = require('path');
const glob = require('glob');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const PurifyCSSPlugin = require('purifycss-webpack');
var inProduction = (process.env.NODE_ENV === 'production');

module.exports = {
    entry: {
        app: [
            './src/js/main.js',
            './src/sass/app.scss'
        ]
    },
    output: {
        path: path.resolve(__dirname, './dist'),
        publicPath: '/dist/', // OVO MORA da bude navedeno zbog slika koje VIS koristi
        filename: '[name].js'
    },

    module: {
        rules: [
            {
                test: /\.s[ac]ss$/,
                use: ExtractTextPlugin.extract({
                    use: ['css-loader', 'sass-loader'],
                    fallback: 'style-loader'
                })
            },
            //{
            //    test: /\.scss$/,
            //    use: [{
            //        loader: "style-loader" // creates style nodes from JS strings
            //    }, {
            //        loader: "css-loader" // translates CSS into CommonJS
            //    }, {
            //        loader: "sass-loader" // compiles Sass to CSS
            //    }]
            //},
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader']
            },
            {
                test:  /\.(png|jpe?g|gif|svg|eot|ttf|woff|woff2)$/,
                loader: 'file-loader',
                options: {
                    name: '[name].[ext]?[hash]'
                }
            },
            {
                test: /node_modules[\\\/]vis[\\\/].*\.js$/,
                loader: 'babel-loader',
                query: {
                    cacheDirectory: true,
                    presets: ["es2015"],
                    plugins: [
                        "transform-es3-property-literals",
                        "transform-es3-member-expression-literals",
                        "transform-runtime"
                    ]
                }
            },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: "babel-loader"
            }
        ]
    },

    plugins: [
        new ExtractTextPlugin('[name].css'),

        new PurifyCSSPlugin({
            paths: glob.sync(path.join(__dirname, 'index.html')),
            minimize: inProduction
        }),

        new webpack.LoaderOptionsPlugin({
            minimize: inProduction
        })
    ],

    devtool: '#eval-source-map'
};

if (inProduction) {
    // change publicPath to './dist/' when env is production
    module.exports.output.publicPath = './dist/';

    module.exports.devtool = '#source-map';

    module.exports.plugins.push(
        new webpack.optimize.UglifyJsPlugin({
            sourceMap: true,
            compress: {
                warnings: false
            }
        })
    );
}