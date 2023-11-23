export function equal(expected, actual) {
  return returnResult(isEqual(expected, actual), expected, actual);
}

export function equalRefs(ref1, ref2) {
  return returnResult(ref1 === ref2, ref1, ref2);
}

function returnResult(pass, expected, actual) {
  if (pass) return true;
  throw { actual: expected, expected: actual };
}

export function throwsError(callback, expectedError, ...args) {
  try {
    callback(...args);
    throw { actual: 'No error', expected: 'Error' };
  } catch (error) {
    if (error.message === expectedError.message) return true;
    throw { actual: error.message, expected: expectedError.message };
  }
}

export function isEqual(expected, actual) {
  // could move most logic to setup, remove branches?
  const PRIMITIVES = ['string', 'number', 'boolean', 'bigint', 'undefined', 'symbol'];
  if (typeof expected !== typeof actual) return false;
  if (expected === null || actual === null) return expected === actual;
  // null is considered primitive, but typeof is 'object'
  if (PRIMITIVES.includes(typeof expected)) return expected === actual;
  if (typeof expected === 'function') return expected.toString() === actual.toString();
  if (typeof expected === 'object') return areObjectsDeepEqual(expected, actual); // RECURSION!
  // if here, something is very wrong and should break?
}
// can i avoid two-function recursion by splitting up the function?

function areObjectsDeepEqual(object1, object2) {
  if (Array.isArray(object1) && Array.isArray(object2)) {
    if (object1.length !== object2.length) return false;
  } else if (!Array.isArray(object1) && !Array.isArray(object2)) {
    if (Object.keys(object1).length !== Object.keys(object2).length) return false;
  } else return false;
  
  for (const i in object1) if (!isEqual(object1[i], object2[i])) return false; // RECURSION!
  return true;
}

// anonymous functions are equal if their contents are equal.
// named functions are equal if their names AND contents are equal.

export default { equal, equalRefs, throwsError, isEqual };