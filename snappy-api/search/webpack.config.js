const path = require('path');
var ZipPlugin = require('zip-webpack-plugin');
module.exports = {
  target: 'node',
  entry: {
    search: './src/index.js',
  },
  output: {
    path: path.join(__dirname, 'dist'),
    publicPath: '/',
    filename: '[name].js',
  },
  module: {
    rules: [
      {
        test: /\.(js)$/,
        exclude: /node_modules/,
        use: ['eslint-loader'],
      },
    ],
  },
  plugins: [new ZipPlugin({filename: 'app.zip'})],
};
