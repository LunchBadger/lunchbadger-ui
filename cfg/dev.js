'use strict';

let _ = require('lodash');
let path = require('path');
let webpack = require('webpack');
let baseConfig = require('./base');
let defaultSettings = require('./defaults');

let config = _.merge({}, baseConfig, {
  cache: true,
  devtool: 'eval',
  plugins: [
    new webpack.NoErrorsPlugin(),
    new webpack.optimize.CommonsChunkPlugin({
      names: ['vendor'],
      minChunks: Infinity
    })
  ],
  resolve: {
    alias: {
      config: `${defaultSettings.srcPath}/config/dev`
    }
  }
});

// Add needed loaders to the defaults here
config.module.loaders.push({
  test: /\.(js|jsx)$/,
  loader: 'babel-loader?cacheDirectory',
  include: [].concat(
    config.additionalPaths,
    [path.join(__dirname, '/../src'), path.join(__dirname, '../plugins')]
  )
});

module.exports = config;
