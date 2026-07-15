const nextJest = require('next/jest');

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files
  dir: './',
});

/** @type {import('jest').Config} */
const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testEnvironment: 'jest-environment-jsdom',
  testTimeout: 15000,
  moduleNameMapper: {
    // Resolve sitecore.config for tests (CdpPageView and others)
    '^sitecore\\.config$': '<rootDir>/sitecore.config.ts',
    // Handle module aliases (should match paths in tsconfig.json)
    '^@/(.*)$': '<rootDir>/src/$1',
    '^components/(.*)$': '<rootDir>/src/components/$1',
    '^lib/(.*)$': '<rootDir>/src/lib/$1',
    '^temp/(.*)$': '<rootDir>/src/temp/$1',
    '^assets/(.*)$': '<rootDir>/src/assets/$1',
    '^enumerations/(.*)$': '<rootDir>/src/enumerations/$1',
    '^types/(.*)$': '<rootDir>/src/types/$1',
    '^shadcd/(.*)$': '<rootDir>/shadcn/$1',
    // Handle CSS imports (with CSS modules)
    '^.+\\.module\\.(css|sass|scss)$': 'identity-obj-proxy',
    // Handle CSS imports (without CSS modules)
    '^.+\\.(css|sass|scss)$': '<rootDir>/__mocks__/styleMock.js',
    // Handle image imports
    '^.+\\.(png|jpg|jpeg|gif|webp|avif|ico|bmp|svg)$': '<rootDir>/__mocks__/fileMock.js',
  },
  testPathIgnorePatterns: [
    '<rootDir>/node_modules/',
    '<rootDir>/.next/',
  ],
  transformIgnorePatterns: [
    '/node_modules/',
    '^.+\\.module\\.(css|sass|scss)$',
    'node_modules/(?!(?:@sitecore-content-sdk|@sitecore-feaas|lucide-react|change-case)/)',
  ],
  testMatch: [
    '<rootDir>/src/__tests__/**/*.test.{js,ts,tsx}',
  ],
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/*.mock.{ts,tsx}',
    '!src/__tests__/**/*',
  ],
};

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
module.exports = createJestConfig(customJestConfig);

