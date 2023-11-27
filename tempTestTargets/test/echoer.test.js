import { equal, throwsError } from '../../asserter.js';
import { describe, it, setLogToConsole, getResults, clearResults, StructureError, ArgumentTypeError } from '../../tester.js'; 
import echoer from '../echoer.js';

// const sync = run(async () => {
//   return await echoer.asyncFunc();  
// });
//console.log('thisGetterContext', thisGetterContext);

// console.log('async', echoer.asyncFunc.constructor);
// console.log('sync', sync.constructor);
// const asyncResult = sync('testInput');
// console.log('asyncResult', asyncResult);

// echoer.syncGen.next().then(result => {
//   console.log('result', result);
// }).catch(err => {
//   console.log('err', err);
// });
// console.log('afterasync2');

// const asyncResult3 = await echoer.syncGen.next();
// console.log('asyncResult3', asyncResult3);

// console.log('describe', describe);
// console.log('describe', describe.toString());

function x(){
  console.log(this);
}
x.bind(x)();


setLogToConsole(false);
describe('testBlockOuter', () => {
  //beforeEach()
  describe('test BlockInner1', () => {
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

describe('FunctestBlockOuter', function () {
  describe('Functest BlockInner1', function () {
    it('Funcshould pass - return same value as argument', function () {
      equal(echoer.echo('t1'), 't1');
    });
    it('Funcshould fail', function () {
      equal(echoer.echo('t1'), 't2');
    });
  });
  describe('FunctestBlockInner2', function () {
    it('Funcshould pass - return same value as argument', function () {
      equal(echoer.echo('t1'), 't1');
    });
  });
});
describe('FunctestBlockOuter2', function () {
});

// for each callstack, run callbacks.

// describe('testAsync', () => {
//   it('should pass - return same value as argument', async () => {
//     equal(await echoer.asyncFunc('t1'), 't1');
//   });
//   it('should fail', async () => {
//     equal(await echoer.asyncFunc('t1'), 't2');
//   });
//   // it('should catch error', async () => {
//   //   throwsError(echoer.asyncFunc, new Error('bad'), 't1');
//   // });
// });

/*
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

describe('testEmptyBlock', () => {});
describe('testEmptyIt', () => {
  it('empty it', () => {});
});




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

try {
  describe('outer describe', () => {
    it('it with nested it', () => {
      it('inner it', () => {
        equal(echoer.echo('t1'), 't1');
      });
    });
  });
} catch (error) {
  incorrectSpecResults.itWithNestedIt = error;
}

try {
  describe(23, () => {});
} catch (error) {
  incorrectSpecResults.describeWithNumberName = error;
}

try {
  describe('no func', 'bad describe arg');
} catch (error) {
  incorrectSpecResults.describeWithBadFunc = error;
}

try {
  describe();
} catch (error) {
  incorrectSpecResults.describeWithoutArgs = error;
}

try {
  describe('no function in describe');
} catch (error) {
  incorrectSpecResults.describeWithoutFunc = error;
}

try {
  describe('duplicate group name', () => {});
  describe('duplicate group name', () => {});
} catch (error) {
  incorrectSpecResults.duplicateGroupName = error;
}

describe('test bad its', () => {
  try {
    it(23, () => {});
  } catch (error) {
    incorrectSpecResults.itWithNumberName = error;
  }
  try {
    it('ba', 'bad it arg');
  } catch (error) {
    incorrectSpecResults.itWithBadFunc = error;
  }
  try {
    it();
  } catch (error) {
    incorrectSpecResults.itWithoutArgs = error;
  }
  try {
    it('no function in it');
  } catch (error) {
    incorrectSpecResults.itWithoutFunc = error;
  }
  try {
    it('duplicate name', () => {});
    it('duplicate name', () => {});
  } catch (error) {
    incorrectSpecResults.duplicateItName = error;
  }
});



const results = getResults();
clearResults();
// Do I want to leave this in? For now, yes, but would rather test results in a separate file.
// Obviously would be best to use separate instances of the library.
// But lets be real, testing a test framework with itself is also probably not ideal.
setLogToConsole(true);
describe('tester correct specs', () => {
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
describe('tester incorrect specs', () => {
  it("should throw error if 'it' is not nested in 'describe'", () => {
    equal(incorrectSpecResults.itWithoutDescribe instanceof StructureError, true);
  });
  it("should throw error if 'describe' is nested in 'it'", () => {
    equal(incorrectSpecResults.itWithNestedDescribe instanceof StructureError, true);
  });
  it("should throw error if 'it' is nested in 'it'", () => {
    equal(incorrectSpecResults.itWithNestedIt instanceof StructureError, true);
  });
  it("should throw error if 'describe' is given a number as a name", () => {
    equal(incorrectSpecResults.describeWithNumberName instanceof ArgumentTypeError, true);
  });
  it("should throw error if 'describe' is given a non-function as a callback", () => {
    equal(incorrectSpecResults.describeWithBadFunc instanceof ArgumentTypeError, true);
  });
  it("should throw error if 'describe' is given no arguments", () => {
    equal(incorrectSpecResults.describeWithoutArgs instanceof ArgumentTypeError, true);
  });
  it("should throw error if 'describe' is given no callback", () => {
    equal(incorrectSpecResults.describeWithoutFunc instanceof ArgumentTypeError, true);
  });
  it("should throw error if 'it' is given a number as a name", () => {
    equal(incorrectSpecResults.itWithNumberName instanceof ArgumentTypeError, true);
  });
  it("should throw error if 'it' is given a non-function as a callback", () => {
    equal(incorrectSpecResults.itWithBadFunc instanceof ArgumentTypeError, true);
  });
  it("should throw error if 'it' is given no arguments", () => {
    equal(incorrectSpecResults.itWithoutArgs instanceof ArgumentTypeError, true);
  });
  it("should throw error if 'it' is given no callback", () => {
    equal(incorrectSpecResults.itWithoutFunc instanceof ArgumentTypeError, true);
  });
  it("should throw error if 'it' is given a duplicate name", () => {
    equal(incorrectSpecResults.duplicateItName instanceof StructureError, true);
  });
  it("should throw error if 'describe' is given a duplicate name", () => {
    equal(incorrectSpecResults.duplicateGroupName instanceof StructureError, true);
  });
});
*/
const results3 = getResults();
console.log('results3', results3)
