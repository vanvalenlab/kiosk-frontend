const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');

module.exports = {
	entry: './src/index.js',
	module: {
		rules: [
			{
				test: /\.(js|jsx)$/,
				exclude: /(node_modules|bower_components)/,
				loader: 'babel-loader',
				options: {
					presets: ['env', 'react']
				}
			},
			{
				test: /\.css$/,
				use: [
					'style-loader',
					'css-loader'
				]
			}
		]
	},
	resolve: { extensions: ['*', '.js', '.jsx'] },
	output: {
		path: path.resolve(__dirname, 'dist', 'client'),
		filename: 'bundle.js',
	},
	devtool: 'source-map',
	mode: 'production',
	plugins: [
		new webpack.HotModuleReplacementPlugin(),
		new HtmlWebpackPlugin({
			title: 'DeepCell',
			template: './public/index.html',
			favicon: './public/favicon.ico',
			hash: true
		}),
		new webpack.DefinePlugin({
			'process.env': {
				'NODE_ENV': JSON.stringify(process.env.NODE_ENV),
				'MODEL_NAME': JSON.stringify(process.env.MODEL_NAME),
				'MODEL_VERSION': JSON.stringify(process.env.MODEL_VERSION),
			}
		})
	]
};
