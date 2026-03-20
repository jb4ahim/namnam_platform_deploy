module.exports = {
  projects: [
    '<rootDir>/apps/customer_api',
    '<rootDir>/apps/management_api',
    '<rootDir>/apps/merchant_api',
    '<rootDir>/apps/driver_api',
    '<rootDir>/libs/common',
    '<rootDir>/libs/database',
    '<rootDir>/libs/auth',
  ],
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/**/*.spec.ts',
    '!src/**/index.ts',
    '!src/**/*.module.ts',
  ],
  coverageThreshold: {
    global: {
      branches: 50,
      functions: 50,
      lines: 50,
      statements: 50,
    },
  },
};
