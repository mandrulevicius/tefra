import echoer from './echoer.js';

setLogToConsole(false);
describe('FunctestBlockOuter', function () {
  describe('Functest BlockInner1', function () {
    test('Funcshould pass - return same value as argument', function () {
      equal(echoer.echo('t1'), 't1');
    });
    test('Funcshould fail', function () {
      equal(echoer.echo('t1'), 't2');
    });
  });
  describe('FunctestBlockInner2', function () {
    test('Funcshould pass - return same value as argument', function () {
      equal(echoer.echo('t1'), 't1');
    });
  });
});

describe('FunctestBlockOuter2', function () {
});

describe('testBlockOuter3', () => {
  describe('testBlock', () => {
    test('should pass - return same value as argument', () => {
      equal(echoer.echo('t1'), 't1');
    });
    test('should fail', () => {
      equal(echoer.echo('t1'), 't2');
    });
    test('should pass - return output object', () => {
      equal(echoer.badStringInput('t1', 'a'), { success: true, output: 't1a' });
    });
    test('should pass - return validation issue', () => {
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
    test('should catch error', () => {
      throwsError(echoer.errFunc, new Error('bad'), 't1');
    });
  });
  describe('testBlock2', () => {
    test('should pass - return same value as argument', () => {
      equal(echoer.echo('t1'), 't1');
    });
    test('should fail', () => {
      equal(echoer.echo('t1'), 't2');
    });
    test('should fail if empty input', () => {
      equal(echoer.echo(), 't2');
    });
    test('should throw error', () => {
      equal(echoer.errFunc('t1'), 't1');
    });
  });
});

describe('testBlockOuterB', () => {
  describe('testBlockB1', () => {
    test('should pass - return same object as argument', () => {
      equal(echoer.echo({ t1: 't1', t2: { t3: 't3' } }), { t1: 't1', t2: { t3: 't3' } });
    });
    test('should fail', () => {
      equal(echoer.echo({ t1: 't1', t2: { t3: 't5' } }), { t1: 't1', t2: { t3: 't3' } });
    });
    test('should fail2', () => {
      equal(echoer.echo(2), 3);
    });
    test('should catch error', () => {
      throwsError(echoer.errFunc, new Error('bad'), 't1');
    });
  });
  describe('testBlockB2', () => {
    const obj = { t1: 't1', t2: { t3: 't3' } };
    test('should pass - return same object as argument', () => {
      is(echoer.echo(obj), obj);
    });
    test('should fail given equal objects with different refs', () => {
      is(echoer.echo(obj), { t1: 't1', t2: { t3: 't3' } });
    });
  });
  runTestBlockB3();
});

function runTestBlockB3() {
  describe('testBlockB3', () => {
    test('B2 should pass - return same value as argument', () => {
      equal(echoer.echo('t1'), 't1');
    });
    test('B2 should fail', () => {
      equal(echoer.echo('t1'), 't2');
    });
    test('B2 should catch error', () => {
      throwsError(echoer.errFunc, new Error('bad'), 't1');
    });
  });
}

describe('testEmptyBlock', () => {});
describe('testEmptyIt', () => {
  test('empty test', () => {});
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
    test('should pass -  setup value reset', () => {
      equal(echoer.echo(setup), 0);
      setup = 't1';
    });
    test('should pass - teardown value not reset yet', () => {
      equal(echoer.echo(teardown), 'tear');
    });
  });
  describe('SnT inner 2 for test function', () => {
    test('should pass - setup value reset', () => {
      equal(echoer.echo(setup), 0);
    });
    test('should pass - teardown value reset', () => {
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
    test('should pass - teardownIt value not reset yet', () => {
      equal(echoer.echo(teardownIt), 'tear');
      setupIt = 2;
    });
    test('should pass - setupIt value reset', () => {
      equal(echoer.echo(setupIt), 0);
    });
    test('should pass - teardownIt value reset', () => {
      equal(echoer.echo(teardownIt), null);
    });
  });;
});
