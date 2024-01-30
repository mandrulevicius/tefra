## Tefra - basic test framework
A small project for practice writing cleaner code and more structured architecture. 

## Features
#### Basic asserter
- equal(actual, expected) - Deep equality
- is(actual, expected) - Reference equality
- throwsError(func, expectedError, ...args) - Error checker

#### Basic test runner
- beforeEach, afterEach
- describe, test

#### Async support
Work In Progress

## Installation
Work In Progress

## Config
Disable logging to console:
```js
setLogToConsole(false);
```

## Run
Run from command line:
```
npm test [optional test path] [optional excluded path or file]
```

Can also run from code by importing testRunner:
```js
import testRunner from './testRunner.js';

await testRunner.runTests(pathUnderTest, exclusions);
```

## Usage
- Create a file ending with .test.js
- Import file under test
- describe the test
- assert the test
- Run tests

## Example
echoer.test.js
```js
import echoer from './echoer.js';

describe('testBlockOuter', () => {
  describe('testBlock', () => {
    let setup = 1;
    let teardown = 1;
    beforeEach(() => {
      setup = 0
    });
    afterEach(() => {
      teardown = null;
    });
    test('should pass - return same value as argument', () => {
      equal(echoer.echo('t1'), 't1');
    });
    test('should fail', () => {
      equal(echoer.echo('t1'), 't2');
    });
    test('should catch error', () => {
      throwsError(echoer.errFunc, new Error('bad'), 't1');
    });
  });
});
```
