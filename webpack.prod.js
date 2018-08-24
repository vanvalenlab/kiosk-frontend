const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const webpack = require("webpack");
const dotenv = require('dotenv');

module.exports = env => {
	// call dotenv and it will return an Object with a parsed key 
	env = dotenv.config().parsed;
			// reduce it to a nice object, the same as before
	const envKeys = Object.keys(env).reduce((prev, next) => {
		prev[`process.env.${next}`] = JSON.stringify(env[next]);
		return prev;
	}, {});

	return {
		entry: "./src/index.js",
		module: {
			rules: [
				{
					test: /\.(js|jsx)$/,
					exclude: /(node_modules|bower_components)/,
					loader: 'babel-loader',
					options: { presets: ['env','react'] }
				},
				{
					test: /\.css$/,
					use: [
						'style-loader',
						"css-loader"
					]
				}
			]
		},
		resolve: { extensions: ['*', '.js', '.jsx'] },
		output: {
			path: path.resolve(__dirname, "dist/"),
			publicPath: "/dist/",
			filename: "bundle.js"
		},
		devtool: 'source-map',
		mode: "production",
		plugins: [
			new webpack.HotModuleReplacementPlugin(),
			new HtmlWebpackPlugin(),
			new webpack.DefinePlugin(envKeys)
		]		
	}
};