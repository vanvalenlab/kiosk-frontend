const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CompressionPlugin = require('compression-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
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
          presets: [
            '@babel/preset-env',
            '@babel/preset-react'
          ]
        }
      },
      {
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader'
        ]
      },
      {
        test: /\.svg$/,
        use: ['@svgr/webpack'],
      },
    ]
  },
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          mangle: true,
        },
        cache: true,
        parallel: true,
        extractComments: false,
      }),
    ],
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
    new webpack.EnvironmentPlugin({
      NODE_ENV: 'production',
      GA_TRACKING_ID: 'UA-169034632-1'
    }),
    new CompressionPlugin({
      test: /\.js$|\.css$|\.html$/,
      filename: '[path].gz[query]',
    })
  ]
};
