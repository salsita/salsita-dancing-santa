var path = require('path');
var webpack = require('webpack');
var sharedConfig = require('./webpack.shared.config');
var aliasConfig = require('./webpack.shared.config').alias;

module.exports = {
  entry: [
    './code/js/index.jsx'
  ],
  plugins: [
    new webpack.optimize.UglifyJsPlugin(),
    new webpack.DefinePlugin({__DEVELOPMENT__: false})
  ].concat(sharedConfig.plugins),
  output: {
    path: path.join(__dirname, '../build'),
    filename: 'app.js'
  },
  module: sharedConfig.module,
  resolve: {
    extensions: ['', '.js', '.jsx'],
    alias: aliasConfig
  }
};
