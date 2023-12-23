import { ArgumentTypeError } from './errors.js';

/**
 * Checks if the provided argument matches the expected type.
 * Throws an error if the types do not match.
 *
 * @param {*} argument - The argument to check the type of.
 * @param {string} expectedType - The expected type of the argument.
 * @returns {boolean} Returns true if the argument type matches the expected type.
 * @throws {ArgumentTypeError} Throws an error if the argument type does not match the expected type.
 */
export function checkType(argument, expectedType) {
  if (typeof argument === expectedType) return true;
  if (expectedType === "array" && Array.isArray(argument)) return true;
  throw new ArgumentTypeError(expectedType, typeof argument);
}

export default { checkType };