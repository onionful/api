const path = require('path');
const slsw = require('serverless-webpack');
const webpack = require('webpack');
const nodeExternals = require('webpack-node-externals');
const HappyPack = require('happypack');
const HardSourceWebpackPlugin = require('hard-source-webpack-plugin');

const {
  lib: {
    entries: entry,
    webpack: { isLocal },
  },
} = slsw;

module.exports = {
  entry,
  target: 'node',
  devtool: 'source-map',
  mode: isLocal ? 'development' : 'production',
  externals: isLocal ? [nodeExternals()] : [],
  module: {
    rules: [
      {
        test: /\.js$/,
        use: 'happypack/loader',
        include: __dirname,
        exclude: /node_modules/,
      },
    ],
  },
  optimization: {
    minimize: false,
    removeAvailableModules: !isLocal,
    removeEmptyChunks: !isLocal,
    mergeDuplicateChunks: !isLocal,
  },
  output: {
    libraryTarget: 'commonjs2',
    path: path.join(__dirname, '.webpack'),
    filename: '[name].js',
    sourceMapFilename: '[file].map',
  },
  plugins: [
    new webpack.DefinePlugin({ 'global.GENTLY': false }),
    new HappyPack({
      loaders: [{ loader: 'babel-loader' }, { loader: 'eslint-loader' }],
    }),
    new HardSourceWebpackPlugin(),
  ],
  resolve: {
    alias: {
      deepmerge$: path.resolve(__dirname, './node_modules/deepmerge/dist/umd.js'),
    },
  },
};
