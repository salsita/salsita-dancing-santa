var path = require('path');
var webpack = require('webpack');
var CopyWebpackPlugin = require('copy-webpack-plugin');
var ModernizrWebpackPlugin = require('modernizr-webpack-plugin');

exports.module = {
  loaders: [
    { test: /\.jsx$|\.js$/, exclude: /node_modules/, loaders: ['babel?presets[]=es2015'] },
    { test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: 'url?limit=10000&mimetype=application/font-woff' },
    { test: /\.sass$/, loader: 'style!css!sass' },
    { test: /\.(ttf|eot|svg|png|jpg)(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: 'file?name=[path][name].[ext]?[hash]' }
  ]
};

exports.plugins = [
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
];
