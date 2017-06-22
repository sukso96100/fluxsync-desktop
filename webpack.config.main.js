var path = require('path');
var webpack = require('webpack');
module.exports = {
  entry: './src/main/index.js',
  output: {
    path: __dirname + '/dist/main/',
    filename: '[name].js'
  },
  module: {
    rules: [
      {test: /\.ts$/, use: 'ts-loader'},
      {test: /\.(png|svg|jpg|gif)$/, use: ['file-loader']}
    ]
  },
  node: {
    __dirname: false,
    __filename: false
  },
  target: 'electron-main'
};
