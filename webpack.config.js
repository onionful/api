const path = require('path');
const slsw = require('serverless-webpack');
const webpack = require('webpack');

module.exports = {
  entry: slsw.lib.entries,
  target: 'node',
  mode: slsw.lib.webpack.isLocal ? 'development' : 'production',
  module: {
    rules: [{
      test: /\.js$/,
      loaders: ['babel-loader', 'eslint-loader'],
      include: __dirname,
      exclude: /node_modules/,
    }],
  },
  plugins: [
    new webpack.DefinePlugin({ 'global.GENTLY': false }),
  ],
  resolve: {
    alias: {
      deepmerge$: path.resolve(__dirname, './node_modules/deepmerge/dist/umd.js'),
    },
  },
};
