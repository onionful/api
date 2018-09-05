/* eslint-disable import/no-extraneous-dependencies */
module.exports = require('babel-jest').createTransformer(
  JSON.parse(require('fs').readFileSync('.babelrc')),
);
