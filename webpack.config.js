const nodeExternals = require('webpack-node-externals');
const path = require('path');
const slsw = require('serverless-webpack');
const webpack = require('webpack');
const { CheckerPlugin, TsConfigPathsPlugin } = require('awesome-typescript-loader');

const {
  lib: {
    entries: entry,
    webpack: { isLocal },
  },
} = slsw;

const paths = {
  context: __dirname,
  babelrc: path.resolve(__dirname, '.babelrc'),
  src: path.resolve(__dirname, 'src'),
  node: path.resolve(__dirname, 'node_modules'),
  webpackCache: path.resolve(__dirname, '.webpack'),
};

module.exports = {
  entry,
  target: 'node',
  devtool: 'source-map',
  mode: isLocal ? 'development' : 'production',
  context: paths.context,
  resolve: {
    modules: [paths.src, 'node_modules'],
    extensions: ['.js', '.ts'],
    symlinks: false,
    plugins: [new TsConfigPathsPlugin()],
  },
  externals: [nodeExternals()],
  module: {
    rules: [
      {
        test: /\.ts$/,
        loader: 'awesome-typescript-loader',
        include: paths.src,
        exclude: /node_modules/,
      },
      {
        test: /\.js$/,
        use: 'babel-loader',
        include: paths.src,
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
    path: paths.webpackCache,
    filename: '[name].js',
    sourceMapFilename: '[file].map',
  },
  plugins: [new webpack.DefinePlugin({ 'global.GENTLY': false }), new CheckerPlugin()],
};
