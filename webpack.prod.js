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
			filename: "bundle.js",
			// publicPath: 'dist/'
		},
		devtool: 'source-map',
		mode: "production",
		plugins: [
			new webpack.HotModuleReplacementPlugin(),
			new HtmlWebpackPlugin({
				title: 'DeepCell',
				template: './public/index.html',
				hash: true,
				filename: './index.html'
			}),
			new webpack.DefinePlugin({
				'process.env': {
					'NODE_ENV': JSON.stringify(process.env.NODE_ENV),
					'AWS_ACCESS_KEY_ID': JSON.stringify(process.env.AWS_ACCESS_KEY_ID),
					'AWS_SECRET_ACCESS_KEY': JSON.stringify(process.env.AWS_SECRET_ACCESS_KEY),
					'AWS_REGION': JSON.stringify(process.env.AWS_REGION),
					'AWS_S3_BUCKET': JSON.stringify(process.env.AWS_S3_BUCKET),
					'REDIS_HOST': JSON.stringify(process.env.REDIS_HOST),
					'REDIS_PORT': JSON.stringify(process.env.REDIS_PORT),
					'MODEL_NAME': JSON.stringify(process.env.MODEL_NAME),
					'MODEL_VERSION': JSON.stringify(process.env.MODEL_VERSION),
				}
			})
		]
	}
};
