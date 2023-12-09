import echoer from './echoer.js';

setLogToConsole(false);
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
    it(' ', () => { // TODO CLEANUP should fail if empty input
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
