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

let pluginDirs = infoFile.plugins.map(plugin => path.resolve(`./plugins/lunchbadger-${plugin}/src`));
let coreDir = path.resolve('./plugins/lunchbadger-core/src');

let config = Object.assign({}, baseConfig, {
  entry: {
    vendor: [
      'moment',
      'lodash'
    ],
    start: startEntry,
    core: './plugins/lunchbadger-core/src/index',
    plugins: pluginDirs
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
  resolve: {
    extensions: ['', '.js', '.jsx'],
    fallback: [coreDir, ...pluginDirs],
    alias: {
      config: `${defaultSettings.srcPath}/config/dev`
    }
  },
  module: defaultSettings.getDefaultModules()
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
