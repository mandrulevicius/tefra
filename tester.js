import consoleLogger from './consoleLogger.js';

const results = {};
const groupStack = [];
const logToConsole = true;
let insideIt = false; // might have issues with async, but will solve as we go.
// also having module-wide internal state means it has to be reset every time something goes wrong
// because otherwise, if the thrown error is caught, program execution will continue
// other function calls will then use the incorrect state

function setLogToConsole(newLogToConsole) {
  logToConsole = newLogToConsole;
}

function getResults() {
  return results;
}

function describe(groupName, callback) {
  if (insideIt) {
    insideIt = false;
    throw new Error(`Invalid structure "${groupName}": 'describe' function cannot be nested inside 'it' function.`);
  }
  const group = groupStack.length > 0 ?
    (groupStack[groupStack.length - 1][groupName] = {}) :
    (results[groupName] = {});
  groupStack.push(group);
  if (logToConsole) consoleLogger.logGroupName(groupName, '  '.repeat(groupStack.length - 1));
  callback();
  groupStack.pop();
}

function it(specName, callback) {
  if (insideIt) {
    insideIt = false;
    throw new Error(`Invalid structure spec "${specName}": 'it' function cannot be nested inside another 'it' function.`);
  }
  insideIt = true;
  const group = groupStack[groupStack.length - 1];
  if (!group) {
    insideIt = false;
    throw new Error(`Invalid structure spec "${specName}": 'it' function must have 'describe' function as parent.`);
  }
  try {
    callback();
    group[specName] = { status: 'pass' };
  } catch (error) {
    if (error instanceof Error) {
      group[specName] = { status: 'error', error: error };
    } else {
      group[specName] = { status: 'fail', error: error };
    }
  }
  if (logToConsole)
    consoleLogger.logSpecResult(group[specName], specName, '  '.repeat(groupStack.length));
  insideIt = false;
}
// REMINDER: this is for one file only.
export default { describe, it, getResults, setLogToConsole };
// DESIGN:
// results can be output anywhere, not the responsibility of tester
// in fact, even logging to console should be a concern of tester
// we are making this concession for now for easy of use, but might remove in the future if unneeded

// DESIGN:
// tester is core, should not care about output types. But real life is messy, so here we are.
// in this case, for a test framework, smooth consumer experience is absolutely essential,
// so better to leave a dependency rather than overengineer and add extra baggage for consumer.
// why not have both? expose the abstraction
// currently, dont see any gains for the additional complexity.
// if at any point potential gains become apparent, will refactor.

// might need serious refactoring, depending on how the multiple file implementation goes.

// TODO use or delete after multiple file implementation is done
// POSSIBLE REFACTOR:
// middleLayer.js
/*
import testerCore from './testerCore.js';

async function setOutputter(outputterName) {
  const outputter = await import(`./${outputterName}.js`);
  testerCore.setOutputter(outputter);
}

export default { ...testerCore, setOutputter };

*/

// ERROR HANDLING SOLUTION OPTIONS:
/*
class CustomError extends Error {
  constructor(message) {
    super(message);
    this.name = 'CustomError';
  }
}

class ParameterTypeError extends Error {
  constructor(expectedType, receivedType) {
    super(`Invalid argument: expected a ${expectedType} but received a ${receivedType}. Please ensure you are passing a ${expectedType} to the function.`);
    this.name = 'ParameterTypeError';
  }
}

if (typeof input !== 'string') {
  throw new ParameterTypeError('string', typeof input);
}


function CustomError(message) {
  this.name = 'CustomError';
  this.message = message;
}
CustomError.prototype = Object.create(Error.prototype);
*/