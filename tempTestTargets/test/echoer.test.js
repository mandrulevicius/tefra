import asserter from '../../asserter.js';
import tester from '../../tester.js'; 
import echoer from '../echoer.js';

// test bad describe/it/asserter calls?

tester.describe('testBlockOuter', () => {
  tester.describe('testBlock1', () => {
    tester.it('should give output x given input x when called', () => {
      asserter.equal(echoer.echo('t1'), 't1');
    });
    tester.it('should fail', () => {
      asserter.equal(echoer.echo('t1'), 't2');
    });
    tester.it('should return validation issue', () => {
      asserter.equal(echoer.badStringInput(3, { foo: 'bar' }), {
        success: false,
        error: {
          message: 'Invalid argument type',
          expected: 'string',
          received: typeof 3,
          input: 3
        }}); // this seems way too clunky. maybe should just expect success false
    });
    tester.it('should give error', () => {
      asserter.throwsError(echoer.errFunc, new Error('bad'), 't1');
    });
  });
  tester.describe('testBlock2', () => {
    tester.it('2should give output x given input x when called', () => {
      asserter.equal(echoer.echo('t1'), 't1');
    });
    tester.it('2should fail', () => {
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
});
