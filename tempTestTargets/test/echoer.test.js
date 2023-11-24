import { equal, throwsError } from '../../asserter.js';
import { describe, it, setLogToConsole, getResults, clearResults } from '../../tester.js'; 
import echoer from '../echoer.js';

setLogToConsole(false);
describe('testBlockOuter', () => {
  describe('testBlockInner1', () => {
    it('should pass - return same value as argument', () => {
      equal(echoer.echo('t1'), 't1');
    });
    it('should fail', () => {
      equal(echoer.echo('t1'), 't2');
    });
  });
  describe('testBlockInner2', () => {
    it('should pass - return same value as argument', () => {
      equal(echoer.echo('t1'), 't1');
    });
  });
});
describe('testBlockOuter2', () => {
});

describe('testBlockOuter3', () => {
  describe('testBlock', () => {
    it('should pass - return same value as argument', () => {
      equal(echoer.echo('t1'), 't1');
    });
    it('should fail', () => {
      equal(echoer.echo('t1'), 't2');
    });
    it('should pass - return output object', () => {
      equal(echoer.badStringInput('t1', 'a'), { success: true, output: 't1a' });
    });
    it('should pass - return validation issue', () => {
      // this seems way too clunky
      equal(echoer.badStringInput(3, { foo: 'bar' }), {
        success: false,
        error: {
          message: 'Invalid argument type',
          expected: 'string',
          received: typeof 3,
          input: 3
        }
      });
      // this is kind of same, but maybe bit better
      const result = echoer.badStringInput(123);
      equal(result.success, false);
      equal(result.error.message, 'Invalid argument type');
      equal(result.error.expected, 'string');
      equal(result.error.received, 'number');
      equal(result.error.input, 123);
    });
    it('should catch error', () => {
      throwsError(echoer.errFunc, new Error('bad'), 't1');
    });
  });
  describe('testBlock2', () => {
    it('should pass - return same value as argument', () => {
      equal(echoer.echo('t1'), 't1');
    });
    it(' ', () => {
      equal(echoer.echo(), 't2');
    });
    it('should fail', () => {
      equal(echoer.echo('t1'), 't2');
    });
    it('should throw error', () => {
      equal(echoer.errFunc('t1'), 't1');
    });
  });
});

describe('testBlockOuterB', () => {
  describe('testBlockB1', () => {
    it('should pass - return same object as argument', () => {
      equal(echoer.echo({ t1: 't1', t2: { t3: 't3' } }), { t1: 't1', t2: { t3: 't3' } });
    });
    it('should fail', () => {
      equal(echoer.echo({ t1: 't1', t2: { t3: 't5' } }), { t1: 't1', t2: { t3: 't3' } });
    });
    it('should fail2', () => {
      equal(echoer.echo(2), 3);
    });
    it('should catch error', () => {
      throwsError(echoer.errFunc, new Error('bad'), 't1');
    });
  });
  runTestBlockB2();
});

function runTestBlockB2() {
  describe('testBlockB2', () => {
    it('B2 should pass - return same value as argument', () => {
      equal(echoer.echo('t1'), 't1');
    });
    it('B2 should fail', () => {
      equal(echoer.echo('t1'), 't2');
    });
    it('B2 should catch error', () => {
      throwsError(echoer.errFunc, new Error('bad'), 't1');
    });
  });
}

describe('testEmptyBlock', () => {
});
describe('testEmptyIt', () => {
  it('empty it', () => {
  });
});

setLogToConsole(true);
const incorrectSpecResults = {};
try {
  it('it without describe', () => {
    equal(echoer.echo('t1'), 't1');
  });
} catch (error) {
  incorrectSpecResults.itWithoutDescribe = error;
}

try {
  describe('outer describe', () => {
    it('it with nested describe', () => {
      describe('nested describe inside it', () => {
        it('inner it', () => {
          equal(echoer.echo('t1'), 't1');
        });
      });
    });
  });
} catch (error) {
  incorrectSpecResults.itWithNestedDescribe = error;
}

const results = getResults();
clearResults(); // Do I want to leave this in? For now, yes, but would rather test results in a separate file
setLogToConsole(true);
describe('tester', () => {
  describe('correct specs', () => {
    it('should have status error', () => {
      equal(results.status, "error");
    });
    it('should pass 12 specs', () => {
      equal(results.passed, 12);
    });
    it('should fail 7 specs', () => {
      equal(results.failed, 7);
    });
    it('should catch 1 error in specs', () => {
      equal(results.errors, 1);
    });
    it('should result in a total of 20 specs', () => {
      equal(results.total, 20);
    });
    const testBlockOuter3details = results.details.testBlockOuter3.details;
    it('should pass test', () => {
      const specName = 'should pass - return same value as argument';
      equal(testBlockOuter3details.testBlock.details[specName].status, 'passed');
    });
    it('should fail test', () => {
      const specName = 'should fail';
      equal(testBlockOuter3details.testBlock.details[specName].status, 'failed');
    });
    it('should pass test - catch error', () => {
      const specName = 'should catch error';
      equal(testBlockOuter3details.testBlock.details[specName].status, 'passed');
    });
    it('should error test', () => {
      const specName = 'should throw error';
      equal(testBlockOuter3details.testBlock2.details[specName].status, 'error');
    });
  });
  describe('incorrect specs', () => {
    it("should throw error if 'it' is not nested in 'describe'", () => {
      equal(incorrectSpecResults.itWithoutDescribe instanceof Error, true);
      // instanceof is ok, but would be better if had customType
    });
    it("should throw error if 'describe' is nested in 'it'", () => {
      equal(incorrectSpecResults.itWithNestedDescribe instanceof Error, true);
    });
  });
});

const results2 = getResults();
console.log('results2', results2)

// wonder what will happen if something does unexpectedly break.
// will need to test.





// describe(23, () => {
// });


//describe('no func', 'bad describe arg');

//describe();
// describe('no function in describe');

// describe('test bad it', () => {
//    it(23, () => {
//    });
  
//   it('ba', 'bad it arg');
  
//   it();
//   it('no function in it');
// });