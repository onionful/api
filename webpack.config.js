const fs = require('fs');
const HappyPack = require('happypack');
const HardSourceWebpackPlugin = require('hard-source-webpack-plugin');
const nodeExternals = require('webpack-node-externals');
const os = require('os');
const path = require('path');
const slsw = require('serverless-webpack');
const webpack = require('webpack');

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

const happyThreadPool = HappyPack.ThreadPool({ size: os.cpus().length });
const babelConfig = JSON.parse(fs.readFileSync(paths.babelrc));

module.exports = {
  entry,
  target: 'node',
  devtool: 'source-map',
  mode: isLocal ? 'development' : 'production',
  context: paths.context,
  resolve: {
    modules: [paths.src, 'node_modules'],
    extensions: ['.js'],
    symlinks: false,
  },
  externals: [nodeExternals()],
  module: {
    rules: [
      {
        test: /\.js$/,
        enforce: 'pre',
        use: 'happypack/loader?id=eslint',
        include: paths.src,
        exclude: /node_modules/,
      },
      {
        test: /\.js$/,
        use: 'happypack/loader?id=babel',
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
  plugins: [
    new webpack.DefinePlugin({ 'global.GENTLY': false }),
    new HappyPack({
      id: 'eslint',
      threadPool: happyThreadPool,
      verbose: false,
      loaders: [{ loader: 'eslint-loader' }],
    }),
    new HappyPack({
      id: 'babel',
      threadPool: happyThreadPool,
      verbose: false,
      loaders: [{ loader: 'babel-loader', options: babelConfig, include: paths.src }],
    }),
    new HardSourceWebpackPlugin({ environmentHash: { files: ['npm-shrinkwrap.json', '.env'] } }),
  ],
};
