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
		mode: "development",
		module: {
			rules: [
				{
					test: /\.(js|jsx)$/,
					exclude: /(node_modules|bower_components)/,
					loader: 'babel-loader',
					options: { presets: ['env'] }
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
		devServer: {
			contentBase: path.join(__dirname, "public/"),
			port: 3000,
			open: true,
			proxy: {
				"/api": "http://localhost:8080"
			},
			host: 'localhost',
			publicPath: "http://localhost:3000/dist/",
			hotOnly: true,
			headers: { 
				"Access-Control-Allow-Origin": "*",
				"Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
				"Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept"
			}
		},
		plugins: [
			new webpack.HotModuleReplacementPlugin(),
			new HtmlWebpackPlugin(),
			new webpack.DefinePlugin(envKeys)
		]		
	}
};