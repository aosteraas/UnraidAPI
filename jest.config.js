/* eslint-disable @typescript-eslint/no-var-requires */
const { pathsToModuleNameMapper } = require('ts-jest/utils');
// In the following statement, replace `./tsconfig` with the path to your `tsconfig` file
// which contains the path mapping (ie the `compilerOptions.paths` option):
const { compilerOptions } = require('./tsconfig');
try {
  require('./jest.env');
} catch {
  console.error(
    `Unable to require ./jest.env.js. IP and COOKIE env vars will be undefined`,
  );
}

const moduleNameMapper = pathsToModuleNameMapper(compilerOptions.paths, {
  prefix: '<rootDir>/',
});

module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleNameMapper,
};
