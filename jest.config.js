const tsConfig = {
  moduleFileExtensions: ['ts', 'js', 'json', 'node', 'jsx', 'tsx'],
  preset: 'ts-jest',

};

module.exports = {
  verbose: true,
  collectCoverage: true,
  collectCoverageFrom: [
    '<rootDir>/**/src/**/*.ts',
    '!<rootDir>/**/src/**/*.test.ts',
  ],
  coverageReporters: ['html', 'json-summary', 'text'],
  coveragePathIgnorePatterns: ['/node_modules/'],
  testEnvironment: 'jsdom',
  projects: [
    {
      ...tsConfig,
      displayName: 'InAppProvider',
      testMatch: ['**/*.test.ts'],
    },
  ],
};
