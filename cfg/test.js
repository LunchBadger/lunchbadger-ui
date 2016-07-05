'use strict';

let path = require('path');
let srcPath = path.join(__dirname, '/../src/');
let defaultSettings = require('./defaults');

let baseConfig = require('./base');

// Add needed plugins here
let BowerWebpackPlugin = require('bower-webpack-plugin');

module.exports = {
  devtool: 'eval',
  module: {
    preLoaders: [
      {
        test: /\.(js|jsx)$/,
        loader: 'isparta-instrumenter-loader',
        include: [
          path.join(__dirname, '/../src')
        ]
      }
    ],
    loaders: [
      {
        test: /\.(png|jpg|gif|svg|ttf|woff|woff2|css|sass|scss|less|styl)$/,
        loader: 'null-loader'
      },
      {
        test: /\.(js|jsx)$/,
        loader: 'babel-loader',
        include: [].concat(
          baseConfig.additionalPaths,
          [
            path.join(__dirname, '/../src'),
            path.join(__dirname, '/../test')
          ]
        )
      }
    ]
  },
  resolve: {
    extensions: [ '', '.js', '.jsx' ],
    alias: {
      actions: `${defaultSettings.srcPath}/actions`,
      dispatcher: `${defaultSettings.srcPath}/dispatcher`,
      components: `${defaultSettings.srcPath}/components`,
      models: `${defaultSettings.srcPath}/models`,
      constants: `${defaultSettings.srcPath}/constants`,
      services: `${defaultSettings.srcPath}/services`,
      stores: `${defaultSettings.srcPath}/stores`
    }
  },
  plugins: [
    new BowerWebpackPlugin({
      searchResolveModulesDirectories: false
    })
  ]
};
