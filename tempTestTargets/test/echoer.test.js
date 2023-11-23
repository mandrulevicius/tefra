import { equal, throwsError } from '../../asserter.js';
import { describe, it, setLogToConsole, getResults } from '../../tester.js'; 
import echoer from '../echoer.js';

setLogToConsole(false);
describe('testBlockOuter', () => {
  describe('testBlockInner1', () => {
    it('should give output x given input x when called', () => {
      equal(echoer.echo('t1'), 't1');
    });
    it('should fail', () => {
      equal(echoer.echo('t1'), 't2');
    });
  });
  describe('testBlockInner2', () => {
    it('should give output x given input x when called', () => {
      equal(echoer.echo('t1'), 't1');
    });
  });
});
describe('testBlockOuter2', () => {
});

describe('testBlockOuter', () => {
  describe('testBlock', () => {
    it('should give output x given input x when called', () => {
      equal(echoer.echo('t1'), 't1');
    });
    it('should fail', () => {
      equal(echoer.echo('t1'), 't2');
    });
    it('should give output object x given input x when called', () => {
      equal(echoer.badStringInput('t1', 'a'), { success:true, output: 't1a' });
    });
    it('should return validation issue', () => {
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
    it('should give error', () => {
      throwsError(echoer.errFunc, new Error('bad'), 't1');
    });
  });
  describe('testBlock2', () => {
    it('2should give output x given input x when called', () => {
      equal(echoer.echo('t1'), 't1');
    });
    it(' ', () => {
      equal(echoer.echo(), 't2');
    });
    it('should fail2', () => {
      equal(echoer.echo('t1'), 't2');
    });
    it('2should give error', () => {
      throwsError(echoer.errFunc, new Error('bad'), 't1');
    });
  });
});

describe('testBlockOuterB', () => {
  describe('testBlockB1', () => {
    it('should give output x given input x when called', () => {
      equal(echoer.echo({ t1: 't1', t2: { t3: 't3' } }), { t1: 't1', t2: { t3: 't3' } });
    });
    it('should fail', () => {
      equal(echoer.echo({ t1: 't1', t2: { t3: 't5' } }), { t1: 't1', t2: { t3: 't3' } });
    });
    it('should fail2', () => {
      equal(echoer.echo(2), 3);
    });
    it('should give error', () => {
      throwsError(echoer.errFunc, new Error('bad'), 't1');
    });
  });
  runTestBlockB2();
});

function runTestBlockB2() {
  describe('testBlockB2', () => {
    it('B2should give output x given input x when called', () => {
      equal(echoer.echo('t1'), 't1');
    });
    it('B2should fail', () => {
      equal(echoer.echo('t1'), 't2');
    });
    it('B2should give error', () => {
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

const results = getResults();
describe('tester', () => {
  it('runs specs', () => {
    equal(results.passed, 11);
    equal(results.failed, 3);
  });
  
  it('handles errors', () => {
    // assertions testing error handling 
  });
});


// wonder what will happen if something does unexpectedly break.
// will need to test.

// try {
//   it('it without describe', () => {
//     equal(echoer.echo('t1'), 't1');
//   });
// } catch (error) {
//   console.log(error)
// }

// try {
//   describe('outer describe', () => {
//     it('it with nested describe', () => {
//       describe('nested describe inside it', () => {
//         it('inner it', () => {
//           equal(echoer.echo('t1'), 't1');
//         });
//       });
//     });
//   });
// } catch (error) {
//   console.log(error)
// }

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