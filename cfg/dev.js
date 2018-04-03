'use strict';

let _ = require('lodash');
let path = require('path');
let webpack = require('webpack');
let baseConfig = require('./base');
let defaultSettings = require('./defaults');
let plugins = [
  'manage',
  'compose',
  'monitor',
  'monetize',
  'optimize'
];
let pluginDirs = plugins.map(plugin => path.resolve(`./plugins/lunchbadger-${plugin}/src`));

let config = _.merge({}, baseConfig, {
  cache: true,
  devtool: 'eval',
  plugins: [
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
  },
  entry: {
    plugins: pluginDirs
  }
});

// Add needed loaders to the defaults here
config.module.loaders.push({
  test: /\.(js|jsx)$/,
  loaders: ['babel-loader?cacheDirectory'],
  include: [].concat(
    config.additionalPaths,
    [path.join(__dirname, '/../src'), path.join(__dirname, '../plugins')]
  )
});

module.exports = config;
