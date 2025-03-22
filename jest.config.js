module.exports = {
  preset: 'jest-preset-angular',
  testEnvironment: 'jsdom',
  transform: {
    '^.+\\.(ts|js|html)$': 'ts-jest',
  },
  testMatch: ['**/+(*.)+(spec).+(ts)'],
  moduleFileExtensions: ['ts', 'js', 'html'],
  coverageDirectory: 'coverage',
};
