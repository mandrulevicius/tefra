import { attachGlobal } from "./globalizer.js";

/**
 * Compares two values for deep equality.
 *
 * @param {*} actual - The actual value.
 * @param {*} expected - The expected value.
 * @returns {boolean} Returns true if equal, otherwise throws object.
 * @throws {object} Throws an object containing the actual and expected values.
 */
export function equal(actual, expected) {
  if (isEqual(actual, expected)) return true;
  throw { actual, expected };
}

/**
 * Compares two values for reference equality.
 *
 * @param {*} actual - The actual value to compare.
 * @param {*} expected - The expected value to compare against.
 * @returns {boolean} True if values are equal, otherwise throws object.
 * @throws {object} Throws an object containing the actual and expected values.
 */
export function is(actual, expected) {
  if (actual === expected) return true;
  throw { actual, expected };
}

/**
 * Tests if calling a callback function throws an expected error.
 *
 * @param {Function} callback - The callback function to test.
 * @param {Error} expectedError - The expected error to be thrown.
 * @param {...*} args - Any arguments to pass to the callback.
 * @returns {boolean} True if the expected error was thrown, otherwise throws object.
 * @throws {object} Throws an object containing the actual and expected values.
*/
export function throwsError(callback, expectedError, ...args) {
  try {
    callback(...args);
    throw { actual: 'No error', expected: expectedError };
  } catch (error) {
    if (error.message === expectedError.message) return true;
    throw { actual: error.message, expected: expectedError.message };
  }
}

/**
 * Compares two values for deep equality.
 *
 * This is a recursive function that will compare all properties and sub-properties
 * of the two values passed in.
 *
 * @param {*} expected - The expected value to compare against.
 * @param {*} actual - The actual value to compare.
 * @returns {boolean} True if the values are deeply equal, false otherwise.
 * @throws {TypeError} - Throws error if unknown type.
 * @recursive
 */
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

attachGlobal(equal);
attachGlobal(is);
attachGlobal(throwsError);

export default { equal, is, throwsError, isEqual };