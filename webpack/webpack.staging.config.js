var path = require('path');
var webpack = require('webpack');
var moduleConfig = require('./webpack.shared.config').module;
var aliasConfig = require('./webpack.shared.config').alias;

module.exports = {
  entry: [
    './code/js/index.jsx'
  ],
  plugins: [
    new webpack.optimize.UglifyJsPlugin(),
    new webpack.DefinePlugin({__DEVELOPMENT__: false})
  ],
  output: {
    path: path.join(__dirname, '../WhatWine/platforms/browser/www'),
    filename: 'app.js'
  },
  module: moduleConfig,
  resolve: {
    extensions: ['', '.js', '.jsx'],
    alias: aliasConfig
  }
};
