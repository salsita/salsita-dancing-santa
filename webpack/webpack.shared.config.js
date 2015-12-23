exports.module = {
  loaders: [
    { test: /\.jsx$|\.js$/, exclude: /node_modules/, loaders: ['babel?presets[]=es2015'] },
    { test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: 'url?limit=10000&minetype=application/font-woff' },
    { test: /\.(ttf|eot|svg|png|jpg)(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: 'file?name=[path][name].[ext]?[hash]' },
    { test: /\.sass$/, loaders: ["style", "css", "sass"] }
  ]
};
