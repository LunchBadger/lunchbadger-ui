'use strict';
let path = require('path');
let defaultSettings = require('./defaults');

// Additional npm or bower modules to include in builds
// Add all foreign plugins you may need into this array
// @example:
// let npmBase = path.join(__dirname, '../node_modules');
// let additionalPaths = [ path.join(npmBase, 'react-bootstrap') ];
let additionalPaths = [
  path.join(__dirname, '../index.js'),
  path.join(__dirname, '../../../index.js'),
  path.join(__dirname, '../../../src')
];

module.exports = {
  additionalPaths: additionalPaths,
  port: defaultSettings.port,
  debug: true,
  devtool: 'eval',
  output: {
    path: path.join(__dirname, '/../dist'),
    filename: 'plugin.js',
    publicPath: `.${defaultSettings.publicPath}`
  },
  devServer: {
    contentBase: './src/',
    historyApiFallback: true,
    hot: true,
    port: defaultSettings.port,
    publicPath: defaultSettings.publicPath,
    noInfo: false
  },
  resolve: {
    extensions: ['', '.js', '.jsx'],
    alias: {
      actions: `${defaultSettings.corePath}/actions`,
      components: `${defaultSettings.corePath}/components`,
      constants: `${defaultSettings.corePath}/constants`,
      dispatcher: `${defaultSettings.corePath}/dispatcher`,
      models: `${defaultSettings.corePath}/models`,
      stores: `${defaultSettings.corePath}/stores`,
      config: `${defaultSettings.corePath}/config` + process.env.REACT_WEBPACK_ENV
    }
  },
  module: {},
  postcss: function () {
    return [
      require('autoprefixer')({
        browsers: ['last 2 versions', 'ie >= 10']
      })
    ];
  }
};
