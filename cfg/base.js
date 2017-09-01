'use strict';
let path = require('path');
let defaultSettings = require('./defaults');
let additionalPaths = [];

const infoFile = require('./load');

let pluginDirs = infoFile.plugins.map(plugin => path.resolve(`./plugins/lunchbadger-${plugin}/src`));
let coreDir = path.resolve('./plugins/lunchbadger-core/src');

module.exports = {
  additionalPaths: additionalPaths,
  port: defaultSettings.port,
  debug: true,
  devtool: 'eval',
  entry: {
    vendor: [
      'babel-polyfill',
      'moment',
      'lodash'
    ],
    start: ['./src/index'],
    core: './plugins/lunchbadger-core/src/index',
    plugins: pluginDirs
  },
  output: {
    path: path.join(__dirname, '/../dist'),
    filename: '[name].js',
    publicPath: defaultSettings.publicPath
  },
  devServer: {
    contentBase: './src/',
    historyApiFallback: true,
    hot: false,
    port: defaultSettings.port,
    publicPath: defaultSettings.publicPath,
    noInfo: false
  },
  node: {
    console: true,
    fs: 'empty',
    net: 'empty',
    tls: 'empty'
  },
  resolve: {
    extensions: ['', '.js', '.jsx']
  },
  module: defaultSettings.getDefaultModules(),
  postcss: function () {
    return [
      require('autoprefixer')({
        browsers: ['last 2 versions', 'ie >= 10']
      })
    ];
  },
  apiUrl: 'http://0.0.0.0:4230/api/',
  gitBase: 'git@github.com:LunchBadger/'
};
