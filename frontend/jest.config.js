export default {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest',
  },
  testMatch: ['**/*.test.tsx'],
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts']
}; 