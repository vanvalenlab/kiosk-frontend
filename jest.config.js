module.exports = {
  transform: {
    '^.+\\.jsx?$': 'babel-jest'
  },
  verbose: true,
  collectCoverage: true,
  collectCoverageFrom: [
    'server/**/*.{js,jsx}',
    // 'src/**/*.{js,jsx}',
    '!**/node_modules/**',
    '!**/vendor/**'
  ]
};
