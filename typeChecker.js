import { ArgumentTypeError } from './errors.js';

export function checkType(argument, expectedType) {
  if (typeof argument === expectedType) return true;
  if (expectedType === 'array' && Array.isArray(argument)) return true;
  throw new ArgumentTypeError(expectedType, typeof argument);
}

export default { checkType };