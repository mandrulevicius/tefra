import asserter from '../../asserter.js';
import tester from '../../tester.js'; 
import echoer from '../echoer.js';

tester.describe('testBlockOuter', () => {
  tester.describe('testBlock', () => {
    tester.it('should give output x given input x when called', () => {
      asserter.equal(echoer.echo('t1'), 't1');
    });
    tester.it('should fail', () => {
      asserter.equal(echoer.echo('t1'), 't2');
    });
    tester.it('should give output object x given input x when called', () => {
      asserter.equal(echoer.badStringInput('t1', 'a'), { success:true, output: 't1a' });
    });
    tester.it('should return validation issue', () => {
      // this seems way too clunky
      asserter.equal(echoer.badStringInput(3, { foo: 'bar' }), {
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
      asserter.equal(result.success, false);
      asserter.equal(result.error.message, 'Invalid argument type');
      asserter.equal(result.error.expected, 'string');
      asserter.equal(result.error.received, 'number');
      asserter.equal(result.error.input, 123);
    });
    tester.it('should give error', () => {
      asserter.throwsError(echoer.errFunc, new Error('bad'), 't1');
    });
  });
  tester.describe('testBlock2', () => {
    tester.it('2should give output x given input x when called', () => {
      asserter.equal(echoer.echo('t1'), 't1');
    });
    tester.it(' ', () => {
      asserter.equal(echoer.echo('t1'), 't2');
    });
    tester.it('should fail2', () => {
      asserter.equal(echoer.echo('t1'), 't2');
    });
    tester.it('2should give error', () => {
      asserter.throwsError(echoer.errFunc, new Error('bad'), 't1');
    });
  });
});

tester.describe('testBlockOuterB', () => {
  tester.describe('testBlockB1', () => {
    tester.it('should give output x given input x when called', () => {
      asserter.equal(echoer.echo('t1'), 't1');
    });
    tester.it('should fail', () => {
      asserter.equal(echoer.echo('t1'), 't2');
    });
    tester.it('should give error', () => {
      asserter.throwsError(echoer.errFunc, new Error('bad'), 't1');
    });
  });
  runTestBlockB2();
});

function runTestBlockB2() {
  tester.describe('testBlockB2', () => {
    tester.it('B2should give output x given input x when called', () => {
      asserter.equal(echoer.echo('t1'), 't1');
    });
    tester.it('B2should fail', () => {
      asserter.equal(echoer.echo('t1'), 't2');
    });
    tester.it('B2should give error', () => {
      asserter.throwsError(echoer.errFunc, new Error('bad'), 't1');
    });
  });
}

tester.describe('testEmptyBlock', () => {
});
tester.describe('testEmptyIt', () => {
  tester.it('empty it', () => {
  });
});

// try {
//   tester.it('it without describe', () => {
//     asserter.equal(echoer.echo('t1'), 't1');
//   });
// } catch (error) {
//   console.log(error)
// }

// try {
//   tester.describe('outer describe', () => {
//     tester.it('it with nested describe', () => {
//       tester.describe('nested describe inside it', () => {
//         tester.it('inner it', () => {
//           asserter.equal(echoer.echo('t1'), 't1');
//         });
//       });
//     });
//   });
// } catch (error) {
//   console.log(error)
// }

// tester.describe(23, () => {
// });


//tester.describe('no func', 'bad describe arg');

//tester.describe();
// tester.describe('no function in describe');

// tester.describe('test bad it', () => {
//    tester.it(23, () => {
//    });
  
//   tester.it('ba', 'bad it arg');
  
//   tester.it();
//   tester.it('no function in it');
// });