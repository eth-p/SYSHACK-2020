const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const GoogleFontsPlugin = require("google-fonts-plugin");
const ExtractCssChunksPlugin = require('extract-css-chunks-webpack-plugin');

module.exports = function (env, argv) {
	return {
		entry: [
			'react-hot-loader/patch',
			'./src/index.jsx'
		],
		output: {
			path: path.resolve(__dirname, 'dist'),
			publicPath: '/',
			filename: argv.hot ? '[name].[hash].js' : '[name].[contenthash].js'
		},
		module: {
			rules: [
				{
					test: /\.(js|jsx)$/,
					use: 'babel-loader',
					exclude: /node_modules/
				},
				{
					test: /\.scss$/,
					use: [
						argv.mode === 'production' ? ExtractCssChunksPlugin.loader : 'style-loader',
						'css-loader',
						'sass-loader'
					]
				},
				{
					test: /\.svg$/,
					use: 'file-loader'
				},
				{
					test: /\.png$/,
					use: [
						{
							loader: 'url-loader',
							options: {
								mimetype: 'image/png'
							}
						}
					]
				}
			]
		},
		resolve: {
			extensions: [
				'.js',
				'.jsx'
			],
			alias: {
				'react-dom': '@hot-loader/react-dom'
			}
		},
		devServer: {
			contentBase: './dist',
			historyApiFallback: true
		},
		plugins: [
			new ExtractCssChunksPlugin(),
			new HtmlWebpackPlugin({
				template: require('html-webpack-template'),
				inject: false,
				appMountId: 'app',
				filename: 'index.html',
				title: 'Hackamon',
				links: [
					'/woff.css',
					'/woff2.css'
				]
			}),
			new GoogleFontsPlugin({
				fonts: [
					{family: "Material Icons"},
					{family: "Source Sans Pro"},
					{family: "Open Sans", variants: ["400", "400italic", "700italic"]}
				]
			})
		],
		optimization: {
			runtimeChunk: 'single',
			splitChunks: {
				cacheGroups: {
					vendor: {
						test: /[\\/]node_modules[\\/]/,
						name: 'vendors',
						chunks: 'all'
					}
				}
			}
		}
	};
};
