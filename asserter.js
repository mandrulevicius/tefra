function isEqual(value1, value2) {
  // could move most logic to setup, remove branches?
  const PRIMITIVES = ['string', 'number', 'boolean', 'bigint', 'undefined', 'symbol'];
  if (typeof value1 !== typeof value2) return false;
  if (value1 === null || value2 === null) return value1 === value2;
  // null is considered primitive, but typeof is 'object'
  if (PRIMITIVES.includes(typeof value1)) return value1 === value2;
  if (typeof value1 === 'function') return value1.toString() === value2.toString();
  if (typeof value1 === 'object') return areObjectsDeepEqual(value1, value2); // RECURSION!
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

export default { isEqual };