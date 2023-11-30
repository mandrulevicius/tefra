import { equal, throwsError } from '../asserter.js';
import { describe, it, beforeEach, afterEach, setLogToConsole, getResults, clearResults, StructureError, ArgumentTypeError } from '../tester.js'; 
import echoer from './dummies/echoer.js';

setLogToConsole(true);
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
    it(' ', () => { // TODO CLEANUP
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

describe('setup and teardown', () => {
  let setup = 1;
  let teardown = 'tear';
  beforeEach(() => {
    setup = 0
  });
  afterEach(() => {
    teardown = null;
  });
  describe('SnT inner 1', () => {
    it('should pass -  setup value reset', () => {
      equal(echoer.echo(setup), 0);
      setup = 't1';
    });
    it('should pass - teardown value not reset yet', () => {
      equal(echoer.echo(teardown), 'tear');
    });
  });
  describe('SnT inner 2 for it function', () => {
    it('should pass - setup value reset', () => {
      equal(echoer.echo(setup), 0);
    });
    it('should pass - teardown value reset', () => {
      equal(echoer.echo(teardown), null);
    });

    let setupIt = 1;
    let teardownIt = 'tear';
    beforeEach(() => {
      setupIt = 0
    });
    afterEach(() => {
      teardownIt = null;
    });
    it('should pass - teardownIt value not reset yet', () => {
      equal(echoer.echo(teardownIt), 'tear');
      setupIt = 2;
    });
    it('should pass - setupIt value reset', () => {
      equal(echoer.echo(setupIt), 0);
    });
    it('should pass - teardownIt value reset', () => {
      equal(echoer.echo(teardownIt), null);
    });
  });;
});


// TEST should throw async error

// describe('testAsync', () => {
//   it('should pass - return same value as argument', () => {
//     //equal(await echoer.asyncFunc('t1'), 't1');
//     echoer.asyncFunc('t1').then((result) => { equal(result, 't1') })
//   });
//   it('should fail', () => {
//     //equal(await echoer.asyncFunc('t1'), 't2');
//     echoer.asyncFunc('t1').then((result) => { equal(result, 't2') }).catch((error) => {throw error})
//     // this still results in the equal result not being caught properly
//   });
//   // it('should catch error', async () => {
//   //   throwsError(echoer.asyncFunc, new Error('bad'), 't1');
//   // });
// });

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

try {
  describe('more than one beforeEach', () => {
    beforeEach(() => {
    });
    beforeEach(() => {
    });
  });
} catch (error) {
  incorrectSpecResults.moreThanOneBeforeEach = error;
};
try {
  beforeEach(() => {
  });
} catch (error) {
  incorrectSpecResults.topLevelBeforeEach = error;
};
try {
  describe('bad describe - beforeEach in it', () => {
    it('it with nested beforeEach', () => {
      beforeEach(() => {
      });
    });
  });
} catch (error) {
  incorrectSpecResults.itWithNestedBeforeEach = error;
};
try {
  describe('bad describe - describe in beforeEach', () => {
    beforeEach(() => {
      describe('error in describe', () => {
      });
    });
  });
} catch (error) {
  incorrectSpecResults.describeInBeforeEach = error;
};

try {
  describe('error in describe', () => {
    echoer.errFunc();
  });
} catch (error) {
  incorrectSpecResults.errorInDescribe = error;
};
try {
  describe('error in beforeEach', () => {
    beforeEach(() => {
      echoer.errFunc()
    });
    describe('error here', () => {
    });
  });
} catch (error) {
  incorrectSpecResults.errorInBeforeEach = error;
};


const results = getResults();
clearResults();
console.log(results);
// Do I want to leave this in? For now, yes, but would rather test results in a separate file.
// Obviously would be best to use separate instances of the library.
// But lets be real, testing a test framework with itself is also probably not ideal.
setLogToConsole(true);
describe('tester correct specs', () => {
  it('should have status error', () => {
    equal(results.status, "error");
  });
  it('should pass 19 specs', () => {
    equal(results.passed, 19);
  });
  it('should fail 7 specs', () => {
    equal(results.failed, 7);
  });
  it('should catch 1 error in specs', () => {
    equal(results.errors, 1);
  });
  it('should result in a total of 27 specs', () => {
    equal(results.total, 27);
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
  it("should throw error if 'beforeEach' is given more than one", () => {
    equal(incorrectSpecResults.moreThanOneBeforeEach instanceof StructureError, true);
  });
  it("should throw error if 'beforeEach' is given at the top level", () => {
    equal(incorrectSpecResults.topLevelBeforeEach instanceof StructureError, true);
  });
  it("should throw error if 'it' is given a nested beforeEach", () => {
    equal(incorrectSpecResults.itWithNestedBeforeEach instanceof StructureError, true);
  });
  it("should throw error if 'beforeEach' is given a nested describe", () => {
    equal(incorrectSpecResults.describeInBeforeEach instanceof StructureError, true);
  });


  it("should throw error if 'describe' has an error in it", () => {
    equal(incorrectSpecResults.errorInDescribe instanceof Error, true);
  });
  it("should throw error if 'beforeEach' has an error in it", () => {
    equal(incorrectSpecResults.errorInBeforeEach instanceof Error, true);
  });
});

const results3 = getResults();
console.log('results3', results3)
