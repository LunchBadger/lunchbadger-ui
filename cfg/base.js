'use strict';
let path = require('path');
let defaultSettings = require('./defaults');
let additionalPaths = [];

module.exports = {
  additionalPaths: additionalPaths,
  port: defaultSettings.port,
  debug: true,
  devtool: 'eval',
  output: {
    path: path.join(__dirname, '/../dist'),
    filename: 'core.js',
    libraryTarget: 'umd',
    library: 'LBCore',
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
      plugins: `${defaultSettings.srcPath}/../plugins`,
      core: `${defaultSettings.srcPath}/../core`
    }
  },
  externals: {
    'React': 'React'
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
