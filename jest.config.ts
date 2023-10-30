import type { Config } from 'jest';

const config: Config = {
  verbose: true,
  testRegex: '.*\\.spec\\.ts$',
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  rootDir: '.',
  coverageDirectory: 'coverage',
  coverageReporters: ['lcov'],
  collectCoverageFrom: ['**/*.(t|j)s', '!**/*.spec.ts'],
  setupFiles: ['./jest.setup.ts'],
};

export default config;
