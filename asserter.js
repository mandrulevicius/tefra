export function equal(actual, expected) {
  if (isEqual(actual, expected)) return true;
  throw { actual, expected };
}

export function is(actual, expected) {
  if (actual === expected) return true;
  throw { actual, expected };
}

export function throwsError(callback, expectedError, ...args) {
  try {
    callback(...args);
    throw { actual: 'No error', expected: expectedError };
  } catch (error) {
    if (error.message === expectedError.message) return true;
    throw { actual: error.message, expected: expectedError.message };
  }
}

// should generate jsdoc with @recursive
export function isEqual(expected, actual) { // Recursive with areObjectsDeepEqual
  if (typeof expected !== typeof actual) return false;
  if (expected === null || actual === null) return expected === actual;
  // null is considered primitive, but typeof is 'object'
  const PRIMITIVES = ['string', 'number', 'boolean', 'bigint', 'undefined', 'symbol'];
  if (PRIMITIVES.includes(typeof expected)) return expected === actual;
  if (typeof expected === 'function') return expected.toString() === actual.toString();
  if (typeof expected === 'object') return areObjectsDeepEqual(expected, actual); // Recursion
  throw new TypeError(`Unknown type: ${typeof expected}`);
}

function areObjectsDeepEqual(object1, object2) { // Recursive with isEqual
  if (object1 === object2) return true; // reference equality, also solves circular reference issue
  if (Array.isArray(object1) && Array.isArray(object2)) {
    if (object1.length !== object2.length) return false;
  } else if (!Array.isArray(object1) && !Array.isArray(object2)) {
    if (Object.keys(object1).length !== Object.keys(object2).length) return false;
  } else return false;
  for (const i in object1) if (!isEqual(object1[i], object2[i])) return false; // Recursion
  return true;
}

function attachGlobal(func) {
  if (global[func.name]) throw new Error(`Global already contains ${func.name}`);
  global[func.name] = func;
}

attachGlobal(equal);
attachGlobal(is);
attachGlobal(throwsError);

export default { equal, is, throwsError, isEqual };