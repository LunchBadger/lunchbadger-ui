'use strict';

let path = require('path');
let webpack = require('webpack');
let baseConfig = require('./base');
let defaultSettings = require('./defaults');

// Add needed plugins here

let config = Object.assign({}, baseConfig, {
  entry: path.join(__dirname, '../src/index'),
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
  loader: 'babel-loader',
  include: [].concat(
    config.additionalPaths,
    [path.join(__dirname, '/../src')]
  )
});

module.exports = config;
