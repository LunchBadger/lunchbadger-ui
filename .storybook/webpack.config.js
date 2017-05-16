const path = require('path');

module.exports = {
  module: {
    loaders: [
      {
        test: /\.scss$/,
        loader: 'style-loader!css-loader!postcss-loader!sass-loader?outputStyle=expanded',
        include: path.resolve(__dirname, '../')
      },
      {
        test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
        loader: "svg-inline-loader",
        include: path.join(__dirname, '/../src/icons')
      },
      {
        test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
        loader: "url-loader?limit=10000&mimetype=image/svg+xml",
        exclude: path.join(__dirname, '/../src/icons'),
      },
    ]
  }
}
