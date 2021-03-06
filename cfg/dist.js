'use strict';

let _ = require('lodash');
let path = require('path');
let webpack = require('webpack');
let baseConfig = require('./base');
let defaultSettings = require('./defaults');
let plugins = [
  'manage',
  'compose'
];
let pluginDirs = plugins.map(plugin => path.resolve(`./plugins/lunchbadger-${plugin}/src`));

let config = _.merge({}, baseConfig, {
  cache: false,
  devtool: 'sourcemap',
  plugins: [
    new webpack.optimize.DedupePlugin(),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': '"production"'
    }),
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
    })
  ],
  resolve: {
    alias: {
      config: `${defaultSettings.srcPath}/config/dist`
    }
  },
  entry: {
    plugins: pluginDirs
  }
});

// Add needed loaders to the defaults here
config.module.loaders.push({
  test: /\.(js|jsx)$/,
  loader: 'babel',
  include: [].concat(
    config.additionalPaths,
    [path.join(__dirname, '/../src'), path.join(__dirname, '/../plugins')]
  )
});

module.exports = config;
