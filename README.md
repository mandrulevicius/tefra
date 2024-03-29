## Tefra - a basic test framework
A small project for practice writing cleaner code and more structured architecture.

## Installation
```
npm install tefra
```

Add to your package.json:
```json
{
  "scripts": {
    "test": "tefra"
  }
}
```

Run from command line:
```
npm test [optional test path] [optional excluded file or folder]
```

## Features
#### Basic asserter
```js
equal(actual, expected); // Deep equality
is(actual, expected); // Reference equality
throwsError(func, expectedError, ...args) // Error assertion
```

#### Basic test runner
```js
describe(groupName, groupFunction);
test(specName, specFunction);
beforeEach(setupFunction);
afterEach(teardownFunction);
```

## Usage
1. Create a file ending with .test.js
2. Import file under test
3. Describe the test
4. Assert the test
5. Run tests

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

## Config
Disable logging to console:
```js
setLogToConsole(false);
```

#### Async support
Currently does not support asynchronous operations.

## Warning
This is an experimental low priority project. Maintenance not scheduled.
Should not be used in production.
