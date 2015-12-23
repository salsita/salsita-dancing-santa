/* eslint-disable */

var path = require('path');
var webpack = require('webpack');
var CopyWebpackPlugin = require('copy-webpack-plugin');
var ModernizrWebpackPlugin = require('modernizr-webpack-plugin');
var moduleConfig = require('./webpack.shared.config').module;

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
    new webpack.DefinePlugin({__DEVELOPMENT__: true}),
    new webpack.ProvidePlugin({
        // Automtically detect jQuery and $ as free var in modules
        // and inject the jquery library
        // This is required by many jquery plugins
        $: "jquery",
        jQuery: "jquery",
        "window.jQuery": "jquery",
        "root.jQuery": "jquery"
    }),
    new CopyWebpackPlugin([
      { from: path.join(__dirname, '../src/index.html') },
      { from: path.join(__dirname, '../assets'), to: 'assets' }
    ]),
    new ModernizrWebpackPlugin({ 'feature-detects': [ 'audio/webaudio' ]})
  ],
  module: moduleConfig
};
