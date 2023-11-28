import consoleLogger from './consoleLogger.js';

function Result(status, passed = 0, failed = 0, errors = 0, total = 0, details = {}) {
  this.status = status;
  this.passed = passed;
  this.failed = failed;
  this.errors = errors;
  this.total = total;
  this.details = details;
  // If I really want to have proper internal derivate values, will have to make it into a class
}

function updateParentResults(parent, groupWithResult) {
  parent.passed += groupWithResult.passed;
  parent.failed += groupWithResult.failed;
  parent.errors += groupWithResult.errors;
  parent.total += groupWithResult.total;
  if (parent.passed === parent.total) parent.status = "pass";
  if (parent.failed > 0) parent.status = "fail";
  if (parent.errors > 0) parent.status = "error";
  // Don't like modifying the parent object directly here, but it is kind of expected anyway.
  // Refactoring everything is not worth it here - would take too much time for minor benefit.
}
// Maybe should have just counted file totals - group subtotals don't seem to be that useful.
// Should have defined the problem better, but it's ok, did not add too much complexity.

const results = new Result();
const groupStack = [];
let logToConsole = true;
let insideIt = false;
// having module-wide internal state means it has to be reset every time something goes wrong
// because otherwise, if the thrown error is caught, program execution will continue
// other function calls will then use the incorrect state
// SOLVED by setting to false if error.

export function setLogToConsole(newLogToConsole) {
  logToConsole = newLogToConsole;
}

export function getResults() {
  return JSON.parse(JSON.stringify(results));
}

export function clearResults() {
  results.passed = 0;
  results.failed = 0;
  results.errors = 0;
  results.total = 0;
  results.status = undefined;
  results.details = {};
  groupStack.length = 0;
  insideIt = false;
}


export function describe(groupName, callback) {
  // maybe should not call it callback, but fine for now
  if (insideIt) {
    insideIt = false;
    throw new StructureError(`'describe' function cannot be nested inside 'it' function.`);
  }
  if (!groupName || typeof groupName !== "string") {
    throw new ArgumentTypeError('string', typeof groupName);
  }
  if (!callback || typeof callback !== "function") {
    throw new ArgumentTypeError('function', typeof callback);
  }

  const parentGroup = groupStack[groupStack.length - 1] || results;
  if (parentGroup instanceof Result) {
    for (const key in parentGroup.details) {
      if (groupName === key) {
        throw new StructureError(`'describe(${groupName})' already exists in this group.`);
      }
    }
  }

  const group = groupStack.length > 0
    ? (groupStack[groupStack.length - 1].details[groupName] = new Result())
    : (results.details[groupName] = new Result());
  groupStack.push(group);
  if (logToConsole)
    consoleLogger.logGroupName(groupName, "  ".repeat(groupStack.length - 1));

  if (callback.constructor.name === 'AsyncFunction') throw new AsyncError();
  callback();

  groupStack.pop();
  updateParentResults(parentGroup, group);
  
  //if (groupStack.length === 0 && logToConsole) consoleLogger.logTotals(results);
  // log file totals when running from test runner
};

export function it(specName, callback) {
  if (insideIt) {
    insideIt = false;
    throw new StructureError(`'it' cannot be nested inside another 'it'.`);
  }
  if (!specName || typeof specName !== "string") {
    throw new ArgumentTypeError('string', typeof specName);
  }
  if (!callback || typeof callback !== "function") {
    throw new ArgumentTypeError('function', typeof callback);
  }
  const group = groupStack[groupStack.length - 1];
  if (!group) {
    throw new StructureError(`'it' must have 'describe' as parent.`);
  }
  if (specName in group.details) {
    throw new StructureError(`'it(${specName})' already exists in this group.`);
  }
  insideIt = true;
  group.total += 1;

  if (callback.constructor.name === 'AsyncFunction') throw new AsyncError();
  try {
    callback();
    group.details[specName] = { status: "passed" };
    group.passed += 1;
  } catch(error) {
    if (error instanceof StructureError) throw error;
    if (error instanceof ArgumentTypeError) throw error;
    if (error instanceof Error) {
      group.details[specName] = { status: "error", error: error };
      group.errors += 1;
    } else {
      group.details[specName] = { status: "failed", output: error };
      group.failed += 1;
    }
  }
  if (group.passed === group.total) group.status = "passed";
  if (group.failed > 0) group.status = "failed";
  if (group.errors > 0) group.status = "error";
  if (logToConsole)
    consoleLogger.logSpecResult(
      group.details[specName],
      specName,
      "  ".repeat(groupStack.length)
    );
  insideIt = false;
};

export function beforeEach(callback) {
  if (!callback || typeof callback !== "function") {
    throw new ArgumentTypeError('function', typeof callback);
  }
}

export class StructureError extends SyntaxError {
  constructor(message) {
    super(`Invalid structure: ${message}`);
    this.name = 'StructureError';
  }
}

export class ArgumentTypeError extends TypeError {
  constructor(expectedType, receivedType) {
    super(`Invalid argument: expected ${expectedType} but received ${receivedType}.`);
    this.name = 'ArgumentTypeError';
    this.expectedType = expectedType;
    this.receivedType = receivedType;
  }
}

export class AsyncError extends Error {
  constructor() {
    super('Asynchronous code is not supported in this version. Please use testerAsync for that.');
    this.name = 'AsyncError';
  }
}

// REMINDER: this is for one file only.
export default { describe, it, beforeEach, getResults, setLogToConsole, clearResults, StructureError, ArgumentTypeError };
// would like to avoid so many exports. maybe the errors and clear results only needed for internal test suite?

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