const path = require('path');
const webpack = require('webpack');
module.exports = {
  target: 'node',
  entry: {
    app: ['./src/index.js'],
  },
  output: {
    path: path.join(__dirname, 'dist'),
    publicPath: '/',
    filename: '[name].js',
  },
  plugins: [new webpack.IgnorePlugin(/^pg-native$/)],
  module: {
    rules: [
      {
        test: /\.(js)$/,
        exclude: /node_modules/,
        use: ['eslint-loader'],
      },
    ],
  },
};
