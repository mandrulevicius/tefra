import { isEqual } from '../asserter.js';

describe('primitives', () => {
  it('should be equal given equal values', () => {
    equal(isEqual(1, 1), true);
    equal(isEqual('t1', 't1'), true);
  });
  it('should not be equal given different values', () => {
    equal(isEqual(1, 2), false);
    equal(isEqual(0, false), false);
    equal(isEqual(1, '1'), false);
    equal(isEqual('t1', 't2'), false);
    equal(isEqual('', false), false);
    equal(isEqual(1, true), false);
    equal(isEqual(1, false), false);
    equal(isEqual(1, null), false);
    equal(isEqual(1, undefined), false);
    equal(isEqual(1, NaN), false);
    equal(isEqual(1, Infinity), false);
    equal(isEqual(1, -Infinity), false);
    equal(isEqual(1, {}), false);
    equal(isEqual(1, []), false);
    equal(isEqual(1, () => {}), false);
    equal(isEqual(1, /a/), false);
    equal(isEqual(1, new Date()), false);
    equal(isEqual(1, new Error()), false);
    equal(isEqual(1, new Set()), false);
    equal(isEqual(1, new Map()), false);
    equal(isEqual(1, new WeakSet()), false);
  });
})

describe('objects', () => {
  it('should be equal given equal objects', () => {
    equal(isEqual({ hey: 't1' }, { hey: 't1' }), true);
  });
  it('should not be equal given different objects', () => {
    equal(isEqual({ hey: 't1' }, { hey: 't2' }), false);
    equal(isEqual({ hey: 't1' }, { hey: 't1', ho: 't2' }), false);
    equal(isEqual({ hey: 't1' }, { ho: 't1' }), false);
    equal(isEqual({ hey: 't1' }, {}), false);
    equal(isEqual({}, { hey: 't1' }), false);
    equal(isEqual({}, {}), true);
  });
});

describe('deep objects', () => {
  it('should be equal given deep equal objects', () => {
    equal(isEqual({ hey: { bay: "yea" } }, { hey: { bay: "yea" } }), true);
  });
  it('should not be equal given deep different objects', () => {
    equal(isEqual({ hey: { bay: "yea" } }, { hey: { bay: "ye" } }), false);
    equal(isEqual({ hey: { bay: "yea" } }, { hey: { bay: "yea", ho: "ho" } }), false);
    equal(isEqual({ hey: { bay: "yea" } }, { hey: { ho: "yea" } }), false);
    equal(isEqual({ hey: { bay: "yea" } }, { hey: "yea" }), false);
    equal(isEqual({ hey: { bay: "yea" } }, { hey: { bay: "yea", ho: "ho" } }), false);
    equal(isEqual({ hey: { bay: "yea" } }, { hey: { bay: "yea" } }), true);
    equal(isEqual({ hey: { bay: "yea" } }, {}), false);
  });
});

describe('functions', () => {
  function test1 () {
    return 'ran function'
  }
  function test2 () {
    return 'ran function'
  }
  function test3 () {
    return 'ran different function'
  }
  it('should be equal given same functions', () => {
    const funky1 = test1;
    equal(isEqual(funky1, test1), true);
  });
  it('should not be equal given equal functions with different names', () => {
    equal(isEqual(test1, test2), false)
  });
  it('should not be equal given different functions', () => {
    equal(isEqual(test1, test3), false)
  });
});

describe('anonymous functions', () => {
  const testers = {
    anon1: () => 'ran anon function',
    anon2: () => 'ran anon function',
    anon3: () => 'ran different anon function'
  }
  it('should be equal given equal anonymous functions', () => {
    equal(isEqual(testers.anon1, testers.anon2), true);
  });
  it('should not be equal given different anonymous functions', () => {
    equal(isEqual(testers.anon1, testers.anon3), false);
  });
});

describe('circular objects', () => {
  it('should be equal given circular objects', () => {
    const circularObj = { name: 'circle' };
    circularObj.circular = circularObj;
    equal(isEqual(circularObj, circularObj), true);
  });
  // what if one has one circlular ref, and the other a diffrent one?
  it('should not be equal given circular objects with different values', () => {
    const circularObj = { name: 'circle' };
    circularObj.circular = circularObj;
    const circularObj2 = { name: 'circle2' };
    circularObj2.circular = circularObj2;
    equal(isEqual(circularObj, circularObj2), false);
  });
});
