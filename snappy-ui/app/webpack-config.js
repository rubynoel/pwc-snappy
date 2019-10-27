const path = require("path");
const webpack = require("webpack");
const ZipPlugin = require("zip-webpack-plugin");

module.exports = env => {
  const envKeys = Object.keys(env).reduce((prev, next) => {
    prev[`process.env.${next}`] = JSON.stringify(env[next]);
    return prev;
  }, {});

  return {
    plugins: [new webpack.DefinePlugin(envKeys)]
  };
};
