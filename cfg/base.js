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
      actions: `${defaultSettings.srcPath}/actions`,
      dispatcher: `${defaultSettings.srcPath}/dispatcher`,
      components: `${defaultSettings.srcPath}/components`,
      models: `${defaultSettings.srcPath}/models`,
      constants: `${defaultSettings.srcPath}/constants`,
      stores: `${defaultSettings.srcPath}/stores`
    }
  },
  externals: {
    "react": {
      root: 'React',
      commonjs2: 'react',
      commonjs: 'react',
      amd: 'react'
    },
    "react-dom": {
      root: 'ReactDOM',
      commonjs2: 'react-dom',
      commonjs: 'react-dom',
      amd: 'react-dom'
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
