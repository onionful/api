module.exports = {
  cacheDirectory: '.jest/cache',
  collectCoverage: true,
  collectCoverageFrom: ['src/**/*.js'],
  coveragePathIgnorePatterns: ['/node_modules/'],
  coverageDirectory: '.jest/coverage',
  moduleDirectories: ['node_modules', 'src'],
  testEnvironment: 'node',
  testMatch: ['**/*.test.js'],
  // transform: {
  //   '^.+\\.js$': '<rootDir>/jest.transform.js',
  // },
  verbose: true,
};
