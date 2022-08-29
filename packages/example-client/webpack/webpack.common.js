/* eslint-disable import/no-extraneous-dependencies */
require('dotenv').config();

const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const reduce = require('lodash/reduce');

const commonPaths = require('./paths');

const mapAliases = (dependencies, folder) =>
	reduce(
		dependencies,
		(acc, dependency) => ({
			[dependency]: path.resolve(`${folder}/${dependency}`),
			...acc,
		}),
		{},
	);

const {
	DEFAULT_TENANT,
	BASE_URL_OVERRIDE,
	REDIRECT_BACK_TO_APP,
	DASHBOARD_URL,
	NODE_ENV,
} = process.env;

module.exports = {
	entry: commonPaths.entryPath,
	module: {
		rules: [
			{
				test: /\.(js|jsx)$/,
				loader: 'babel-loader',
				include: [commonPaths.devRoot],
			},
			{
				test: /\.(png|jpg|gif|svg)$/,
				use: [
					{
						loader: 'file-loader',
						options: {
							outputPath: commonPaths.imagesFolder,
						},
					},
				],
			},
			{
				test: /\.(woff2|ttf|woff|eot)$/,
				use: [
					{
						loader: 'file-loader',
						options: {
							outputPath: commonPaths.fontsFolder,
						},
					},
				],
			},
		],
	},
	resolve: {
		modules: ['node_modules', 'src', commonPaths.webAppSrc],
		extensions: ['*', '.js', '.jsx', '.css', '.scss'],
		alias: mapAliases(
			[
				'react',
				'react-dom',
				'react-router-dom',
				'history',
				'recoil',
			],
			'./node_modules',
		),
		fallback: {
			buffer: require.resolve('buffer'),
			crypto: require.resolve('crypto-browserify'),
			process: require.resolve('process/browser'),
			stream: require.resolve('stream-browserify'),
			util: require.resolve('util'),
		},
	},
	plugins: [
		new webpack.DefinePlugin({
			'process.env': JSON.stringify({
				DEFAULT_TENANT,
				BASE_URL_OVERRIDE,
				REDIRECT_BACK_TO_APP,
				DASHBOARD_URL,
				NODE_ENV,
			}),
		}),
		new webpack.ProvidePlugin({
			process: 'process/browser',
		}),
		new webpack.ProgressPlugin(),
		new HtmlWebpackPlugin({
			template: commonPaths.templatePath,
			scriptLoading: 'defer',
		}),
	],
};
