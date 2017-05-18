'use strict';

let _ = require('lodash');
let path = require('path');
let webpack = require('webpack');
let baseConfig = require('./base');
let defaultSettings = require('./defaults');

let config = _.merge({}, baseConfig, {
  cache: true,
  devtool: 'sourcemap',
  plugins: [
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      },
      sourceMap: false
    }),
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.optimize.AggressiveMergingPlugin(),
    new webpack.NoErrorsPlugin(),
    new webpack.optimize.CommonsChunkPlugin({
      names: ['vendor'],
      minChunks: Infinity
    }),
    new webpack.DefinePlugin({
      'process.env': {
        'LBSERVER_HOST': JSON.stringify(process.env.LBSERVER_HOST || 'localhost')
      }
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
  loader: 'babel',
  include: [].concat(
    config.additionalPaths,
    [path.join(__dirname, '/../src'), path.join(__dirname, '../plugins')]
  )
});

module.exports = config;
