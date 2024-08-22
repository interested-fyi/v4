const config = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    roots: ["<rootDir>/src"],
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
    moduleNameMapper: {
      "^@/(.*)$": "<rootDir>/src/$1"
    },
    testPathIgnorePatterns: ['<rootDir>/.next/', '<rootDir>/node_modules/'],
    transform: {
      '^.+\\.(ts|tsx)$': 'ts-jest',
    },
  };

  export default config;