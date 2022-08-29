/* eslint-disable import/no-extraneous-dependencies */
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const { merge } = require('webpack-merge');
const common = require('./webpack.common');

const commonPaths = require('./paths');

const config = {
	mode: 'production',
	output: {
		filename: `${commonPaths.jsFolder}/[name].[hash].js`,
		path: commonPaths.outputPath,
		chunkFilename: `${commonPaths.jsFolder}/[name].[chunkhash].js`,
	},
	optimization: {
		minimizer: [
			new TerserPlugin({
				// Use multi-process parallel running to improve the build speed
				// Default number of concurrent runs: os.cpus().length - 1
				parallel: true,
			}),
			new CssMinimizerPlugin(),
		],
		// Automatically split vendor and commons
		// https://twitter.com/wSokra/status/969633336732905474
		// https://medium.com/webpack/webpack-4-code-splitting-chunk-graph-and-the-splitchunks-optimization-be739a861366
		splitChunks: {
			cacheGroups: {
				defaultVendors: {
					test: /[\\/]node_modules[\\/]/,
					name: 'vendors',
					chunks: 'initial',
				},
				async: {
					test: /[\\/]node_modules[\\/]/,
					name: 'async',
					chunks: 'async',
					minChunks: 4,
				},
			},
		},
		// Keep the runtime chunk seperated to enable long term caching
		// https://twitter.com/wSokra/status/969679223278505985
		runtimeChunk: true,
	},

	module: {
		rules: [
			{
				test: /\.(css|scss)$/,
				use: [
					MiniCssExtractPlugin.loader,
					{
						loader: 'css-loader',
						options: {
							sourceMap: false,
							modules: {
								localIdentName: '[local]',
								exportLocalsConvention: 'camelCase',
							},
						},
					},
					'sass-loader',
				],
			},
		],
	},
	plugins: [
		new CleanWebpackPlugin(),
		new MiniCssExtractPlugin({
			filename: `${commonPaths.cssFolder}/[name].[hash].css`,
			chunkFilename: `${commonPaths.cssFolder}/[name].[chunkhash].css`,
		}),
		new BundleAnalyzerPlugin({
			analyzerMode: 'disabled',
			generateStatsFile: true,
			statsFilename: '../stats/bundle-report.json',
		}),
	],
	devtool: 'source-map',
};

module.exports = merge(common, config);
