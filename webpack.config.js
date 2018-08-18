const path = require('path');
const slsw = require('serverless-webpack');
const webpack = require('webpack');

module.exports = {
  entry: slsw.lib.entries,
  target: 'node',
  devtool: 'source-map',
  mode: slsw.lib.webpack.isLocal ? 'development' : 'production',
  module: {
    rules: [
      {
        test: /\.js$/,
        loaders: [
          { loader: 'cache-loader' },
          { loader: 'thread-loader', options: { workers: require('os').cpus().length - 1 } },
          { loader: 'babel-loader' },
          { loader: 'eslint-loader' },
        ],
        include: __dirname,
        exclude: /node_modules/,
      },
    ],
  },
  optimization: {
    minimize: false,
  },
  output: {
    libraryTarget: 'commonjs2',
    path: path.join(__dirname, '.webpack'),
    filename: '[name].js',
    sourceMapFilename: '[file].map',
  },
  plugins: [new webpack.DefinePlugin({ 'global.GENTLY': false })],
  resolve: {
    alias: {
      deepmerge$: path.resolve(__dirname, './node_modules/deepmerge/dist/umd.js'),
    },
  },
};
