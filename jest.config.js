module.exports = {
  verbose: true,
  setupFilesAfterEnv: ['./jest-setup-files-after-env.js'],
  // NOTE: this need to run jest inside src/repo project (for more details: https://github.com/facebook/jest/issues/8006)
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': ['babel-jest', { rootMode: 'upward' }],
  },
  testEnvironment: 'jest-environment-jsdom',
};
