const nextJest = require('next/jest');

const createJestConfig = nextJest({
  dir: './',
});

const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testEnvironment: 'jest-environment-jsdom',
  testTimeout: 15000,
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^components/(.*)$': '<rootDir>/src/components/$1',
    '^lib/(.*)$': '<rootDir>/src/lib/$1',
    '^shadcn/(.*)$': '<rootDir>/shadcn/$1',
    '^shadcd/(.*)$': '<rootDir>/shadcn/$1',
    'sitecore.config': '<rootDir>/sitecore.config.ts',
    '^\\.sitecore/component-map$': '<rootDir>/src/__mocks__/component-map.ts',
    '^(\\.\\./)*\\.sitecore/component-map$': '<rootDir>/src/__mocks__/component-map.ts',
  },
  testMatch: [
    '<rootDir>/src/__tests__/**/*.test.[jt]s?(x)',
  ],
  transformIgnorePatterns: [
    'node_modules/(?!(?:@sitecore-content-sdk|@sitecore-feaas|lucide-react|change-case)/)',
  ],
  collectCoverageFrom: [
    'src/components/**/*.{js,jsx,ts,tsx}',
    '!src/components/**/*.stories.{js,jsx,ts,tsx}',
    '!src/components/**/__tests__/**',
    '!src/**/*.d.ts',
  ],
  coverageReporters: ['text', 'lcov', 'html', 'json-summary'],
  coverageDirectory: '<rootDir>/coverage',
  // Optimize memory usage
  maxWorkers: '50%', // Use 50% of available CPU cores
  workerIdleMemoryLimit: '512MB', // Restart workers after they use this much memory
  // Cache configuration
  cache: true,
  cacheDirectory: '<rootDir>/.jest-cache',
};

module.exports = createJestConfig(customJestConfig);
