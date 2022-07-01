require('dotenv').config({ path: `${process.env.NODE_ENV}.env` });

const path = require('path');
const webpack = require('webpack');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const jsLoaders = require('./loaders/js-loaders');
const cssLoaders = require('./loaders/css-loaders');

module.exports = {
  target: 'web',
  entry: {
    app: path.join(__dirname, '../src/index.js'),
    styles: path.join(__dirname, '../src/styles/style.css')
  },
  output: {
    publicPath: '/',
    filename: '[name].bundle.js',
    path: path.join(__dirname, '../dist'),
    chunkFilename: '[name]-[id].js',
    clean: true,
  },
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: cssLoaders
      },
      {
        test: /\.js$/i,
        use: jsLoaders,
        exclude: [/(node_modules)/]
      }
    ]
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.BACKEND_URL': JSON.stringify(process.env.BACKEND_URL)
    }),
    new HtmlWebpackPlugin({
      template: path.join(__dirname, '../src/index.html')
    }),
    new MiniCssExtractPlugin({
      // Options similar to the same options in webpackOptions.output
      // both options are optional
      filename: '[name].css',
      chunkFilename: '[id].css',
    })
  ]
};
