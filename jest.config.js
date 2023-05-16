/** @type {import('jest').Config} */
const config = {
  verbose: true,
  testRegex: '.*\\.spec\\.ts$',
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  rootDir: 'lib',
  coverageDirectory: '../coverage',
  coverageReporters: ['lcov'],
  collectCoverageFrom: ['**/*.(t|j)s', '!**/*.spec.ts'],
  setupFiles: ['../jest.setup.ts'],
};

module.exports = config;
