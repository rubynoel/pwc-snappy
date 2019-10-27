const path = require("path");
const webpack = require("webpack");
const ZipPlugin = require("zip-webpack-plugin");
module.exports = {
  target: "node",
  entry: "./src/index.js",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "index.js",
    libraryTarget: "commonjs"
  },
  module: {
    rules: [
      {
        test: /\.(js)$/,
        exclude: /node_modules/,
        use: ["eslint-loader"]
      }
    ]
  },
  plugins: [
    new ZipPlugin({ filename: "app.zip" }),
    new webpack.IgnorePlugin(/^pg-native$/)
  ]
};
