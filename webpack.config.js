const path = require('path');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

const isProd = process.env.NODE_ENV === 'production';

let plugins = [new ExtractTextPlugin('css/style.css')];

if (isProd) {
	plugins.push(new UglifyJsPlugin({
		uglifyOptions: {
            output: {
                comments: false,
                beautify: false
            },
		}
	}));
}

module.exports = {
	entry: "./src/scripts/index.js",

	devtool: isProd ? false : 'source-map',

	output: {
		path: path.resolve(__dirname, "dist"),
		filename: "js/index.js"
	},

	watch: !isProd,

	watchOptions: {
		aggregateTimeout: 300
	},

	module: {
		rules: [
			{
				test: /\.js$/,
				exclude: /(node_modules|bower_components)/,
				use: {
					loader: 'babel-loader',
					options: {
						presets: ['@babel/preset-env'],
						plugins: [require('@babel/plugin-proposal-object-rest-spread')]
					}
				}
			},
			{
				test: /\.scss$/,
				use: ExtractTextPlugin.extract({
					fallback: 'style-loader',
					use: [
						{
							loader: 'css-loader',
							options: {
								sourceMap: !isProd,
								minimize: isProd
							}
						},
						{
							loader: 'postcss-loader',
							options: {sourceMap: !isProd}
						},
						{
							loader: 'sass-loader',
							options: {sourceMap: !isProd}
						}
					]
				})
			},
			{
				test: /\.(png|jpg|gif|svg)$/,
				use: [
					{
						loader: 'file-loader',
						options: {
							name: '[name].[ext]',
							publicPath: '../images/style/',
							outputPath: 'images/style/'
						}
					}
				]
			},
			{
				test: /\.(woff|woff2|eot|ttf|otf)$/,
				use: [
					{
						loader: 'file-loader',
						options: {
							context: 'src/',
							name: '[path][name].[ext]',
							publicPath: '../'
						}
					}
				]
			},
			{
				test: /\.modernizrrc.js$/,
				use: [ 'modernizr-loader' ]
			},
			{
				test: /\.modernizrrc(\.json)?$/,
				use: [ 'modernizr-loader', 'json-loader' ]
			}
		]
	},

	plugins: plugins,

	resolve: {
		alias: {
			modernizr$: path.resolve(__dirname, ".modernizrrc")
		}
	}
}

