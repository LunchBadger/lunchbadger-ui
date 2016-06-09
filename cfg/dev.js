'use strict';

let path = require('path');
let webpack = require('webpack');
let baseConfig = require('./base');
let defaultSettings = require('./defaults');

const infoFile = require('./load');

// Add needed plugins here

let config = Object.assign({}, baseConfig, {
  entry: {
    start: [
      'webpack-dev-server/client?http://127.0.0.1:' + defaultSettings.port,
      './src/index'
    ],
    core: './plugins/lunchbadger-core/index',
    plugins: infoFile.plugins.map((plugin) => { return ('./plugins/lunchbadger-' + plugin); })
  },
  cache: true,
  devtool: 'eval',
  plugins: [
    new webpack.NoErrorsPlugin()
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
