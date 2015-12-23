var path = require('path');
var webpack = require('webpack');
var sharedConfig = require('./webpack.shared.config');

module.exports = {
  debug: true,
  devtool: 'source-map',
  entry: [
    'webpack-dev-server/client?http://localhost:8080',
    'webpack/hot/only-dev-server',
    path.join(__dirname, '../src/js/app.js')
  ],
  output: {
    path: path.join(__dirname, '../build'),
    filename: 'app.js'
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin(),
    new webpack.DefinePlugin({__DEVELOPMENT__: true})
  ].concat(sharedConfig.plugins),
  module: sharedConfig.module
};
