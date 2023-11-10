import asserter from '../../asserter.js';
import tester from '../../tester.js'; 
import echoer from '../echoer.js';

tester.describe('testBlockOuter', () => {
  tester.describe('testBlock1', () => {
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
});

//tester.printAllResults()
