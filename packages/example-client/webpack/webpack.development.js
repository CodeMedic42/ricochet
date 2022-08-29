/* eslint-disable import/no-extraneous-dependencies */
const webpack = require('webpack');
const { merge } = require('webpack-merge');
const portFinder = require('portfinder');
const set = require('lodash/set');
const common = require('./webpack.common');
const commonPaths = require('./paths');

const config = {
	mode: 'development',
	output: {
		filename: '[name].js',
		path: commonPaths.outputPath,
		chunkFilename: '[name].js',
		publicPath: '/',
	},
	devtool: 'eval-source-map',
	module: {
		rules: [
			{
				test: /\.(css|scss)$/,
				use: [
					'style-loader',
					{
						loader: 'css-loader',
						options: {
							sourceMap: true,
							modules: {
								localIdentName: '[local]',
								exportLocalsConvention: 'camelCase',
							},
						},
					},
					'sass-loader',
				],
			},
			{
				test: /\.js$/,
				use: ['source-map-loader'],
				enforce: 'pre',
				exclude: /react-hot-loader/,
			},
		],
	},
	// TODO: There is a bug with hot module replacement with webpack 5, dev server 3 and
	// .browserlistrc. Remove "target: 'web'" when dev server releases v4
	// https://github.com/webpack/webpack-dev-server/issues/2758
	target: 'web',
	devServer: {
		static: commonPaths.outputPath,
		allowedHosts: 'all',
		compress: true,
		hot: true,
		historyApiFallback: true,
		open: true,
		host: process.env.HOST || 'localhost',
	},
	plugins: [new webpack.HotModuleReplacementPlugin()],
};

module.exports = () =>
	portFinder
		.getPortPromise({
			port: process.env.PORT || 8080,
		})
		.catch(() => '8080')
		.then((port) => {
			set(config, 'devServer.port', port);
			return merge(common, config);
		});
