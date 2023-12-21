// feel like this project is too small to be concerned about global utilities

// on the other hand, have 3 places where attachGlobal is duplicated


import { ArgumentTypeError } from './errors.js';

const globalNamespace = determineGlobal();
const moduleNamespace = createModuleNamespace('tefra');

function determineGlobal() {
  return typeof window !== 'undefined' ? window : global;
}

function createModuleNamespace(namespace) {
  if (globalNamespace[namespace]) throw new Error(`Global already contains ${namespace}`);
  globalNamespace[namespace] = {};
  return globalNamespace[namespace];
}

function checkType(argument, expectedType) {
  if (typeof argument === expectedType) return true;
  if (expectedType === 'array' && Array.isArray(argument)) return true;
  throw new ArgumentTypeError(expectedType, typeof argument);
}


function attachGlobal(arg, name = arg.name) {
  if (!name) throw new Error(`No name provided`);
  if (moduleNamespace[name] !== undefined) throw new Error(`Global already contains ${name}`);
  moduleNamespace[name] = arg;
}
// Mainly for functions. If need to hold global state, make sure to use setters.

attachGlobal(attachGlobal);
attachGlobal(checkType);
