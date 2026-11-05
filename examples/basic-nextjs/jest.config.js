/** @type {import('@jest/types').Config.InitialOptions} */
module.exports = {
  projects: [
    {
      displayName: 'ui',
      testEnvironment: 'jsdom',
      roots: ['<rootDir>/src'],
      testMatch: ['**/__tests__/**/*.test.tsx', '**/__tests__/**/*.test.ts'],
      transform: {
        '^.+\\.tsx?$': [
          'ts-jest',
          {
            tsconfig: 'tsconfig.json',
            jsx: 'react-jsx',
          },
        ],
      },
      moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/src/$1',
        '^components/(.*)$': '<rootDir>/src/components/$1',
        '^lib/(.*)$': '<rootDir>/src/lib/$1',
        '^src/(.*)$': '<rootDir>/src/$1',
        // tsconfig baseUrl import used by client code (e.g. src/lib/search-ui/locale.ts)
        '^sitecore\\.config$': '<rootDir>/sitecore.config.ts',
        '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
      },
      setupFilesAfterEnv: ['<rootDir>/src/__tests__/setup.ts'],
    },
    {
      // Agents tooling (tools/agents): plain CommonJS on Node, no transform.
      displayName: 'agents',
      testEnvironment: 'node',
      roots: ['<rootDir>/tools/agents'],
      testMatch: ['**/__tests__/**/*.test.js'],
      transform: {},
    },
  ],
};
