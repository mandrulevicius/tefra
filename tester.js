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

function updateResults(parent, groupWithResult) {
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

const results = new Result();
const groupStack = [];
let logToConsole = true;
let insideIt = false; // might have issues with async, but will solve as we go.
// also having module-wide internal state means it has to be reset every time something goes wrong
// because otherwise, if the thrown error is caught, program execution will continue
// other function calls will then use the incorrect state
// SOLVED by setting to false if error.

export function setLogToConsole(newLogToConsole) {
  logToConsole = newLogToConsole;
}

export function getResults() {
  // console.log('res', results);
  // console.log('res.details', results.details);
  // console.log('res.details.testBlockOuter.details', results.details.testBlockOuter.details);
  return results;
}

export function describe(groupName, callback) {
  if (insideIt) {
    insideIt = false;
    throw new Error(
      `Invalid structure group "${groupName}": 'describe' function cannot be nested inside 'it' function.`
    );
  }
  if (!groupName || typeof groupName !== "string") {
    throw new Error(
      `Invalid structure group "${groupName}": group must have a string name`
      // improve error messages to both say what is wrong, and how to fix it.
    );
  }
  if (!callback || typeof callback !== "function") {
    throw new Error(
      `Invalid structure group "${groupName}": group must have a function callback`
    );
  }
  const parentGroup = groupStack[groupStack.length - 1];
  if (parentGroup instanceof Result) {
    for (const key in parentGroup.details) {
      if (groupName in parentGroup.details[key]) {
        throw new Error(
          `Invalid structure group "${groupName}": group name already exists`
        );
      }
    }
  }
  const group = groupStack.length > 0
    ? (groupStack[groupStack.length - 1].details[groupName] = new Result())
    : (results.details[groupName] = new Result());
  groupStack.push(group);
  if (logToConsole)
    consoleLogger.logGroupName(groupName, "  ".repeat(groupStack.length - 1));
  callback();
  groupStack.pop();
  if (parentGroup instanceof Result) updateResults(parentGroup, group);
  else {
    updateResults(results, group);
  }
  //if (groupStack.length === 0 && logToConsole) consoleLogger.logTotals(results);
  // log file totals when running from test runner
}

export function it(specName, callback) {
  if (insideIt) {
    insideIt = false;
    throw new Error(
      `Invalid structure spec "${specName}": 'it' function cannot be nested inside another 'it' function.`
    );
  }
  if (!specName || typeof specName !== "string") {
    throw new Error(
      `Invalid structure spec "${specName}": spec must have a string name`
    );
  }
  if (!callback || typeof callback !== "function") {
    throw new Error(
      `Invalid structure spec "${specName}": spec must have a function callback`
    );
  }
  const group = groupStack[groupStack.length - 1];
  if (!group) {
    throw new Error(
      `Invalid structure spec "${specName}": 'it' function must have 'describe' function as parent.`
    );
  }
  if (specName in group.details) {
    throw new Error(
      `Invalid structure spec "${specName}": spec name already exists`
    );
  }
  insideIt = true;
  group.total += 1;
  try {
    callback();
    group.details[specName] = { status: "pass" };
    group.passed += 1;
  } catch (error) {
    if (error instanceof Error) {
      group.details[specName] = { status: "error", error: error };
      group.errors += 1;
    } else {
      group.details[specName] = { status: "fail", output: error };
      group.failed += 1;
    }
  }
  if (group.passed === group.total) group.status = "pass";
  if (group.failed > 0) group.status = "fail";
  if (group.errors > 0) group.status = "error";
  if (logToConsole)
    consoleLogger.logSpecResult(
      group.details[specName],
      specName,
      "  ".repeat(groupStack.length)
    );
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