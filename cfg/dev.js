'use strict';

let path = require('path');
let webpack = require('webpack');
let baseConfig = require('./base');
let defaultSettings = require('./defaults');

const infoFile = require('./load');
const args = process.argv.slice(2);

let startEntry;

if (args.indexOf('--no-server') === -1) {
  startEntry = [
    'webpack-dev-server/client?http://127.0.0.1:' + defaultSettings.port,
    './src/index'
  ];
} else {
  startEntry = ['./src/index'];
}

console.log(startEntry);

let config = Object.assign({}, baseConfig, {
  entry: {
    vendor: [
      'moment',
      'lodash'
    ],
    start: startEntry,
    core: './plugins/lunchbadger-core/index',
    plugins: infoFile.plugins.map((plugin) => { return ('./plugins/lunchbadger-' + plugin); })
  },
  cache: true,
  devtool: 'eval',
  plugins: [
    new webpack.NoErrorsPlugin(),
    new webpack.optimize.CommonsChunkPlugin({
      names: ['vendor'],
      minChunks: Infinity
    })
  ],
  module: defaultSettings.getDefaultModules()
});

// Add needed loaders to the defaults here
config.module.loaders.push({
  test: /\.(js|jsx)$/,
  loader: 'babel-loader?cacheDirectory',
  include: [].concat(
    config.additionalPaths,
    [path.join(__dirname, '/../src')]
  )
});

module.exports = config;
