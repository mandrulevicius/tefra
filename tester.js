import consoleLogger from './consoleLogger.js';

function Result(status, passed = 0, failed = 0, error = 0, total = 0, details = {}) {
  this.status = status;
  this.passed = passed;
  this.failed = failed;
  this.error = error;
  this.total = total;
  this.details = details;
  // If I really want to have proper internal derivate values, will have to make it into a class
}

function updateParentResults(parent, groupWithResult) {
  parent.passed += groupWithResult.passed;
  parent.failed += groupWithResult.failed;
  parent.error += groupWithResult.error;
  parent.total += groupWithResult.total;
  if (parent.passed === parent.total) parent.status = 'pass';
  if (parent.failed > 0) parent.status = 'fail';
  if (parent.error > 0) parent.status = 'error';
  // Don't like modifying the parent object directly here, but it is kind of expected anyway.
  // Refactoring everything is not worth it here - would take too much time for minor benefit.
}
// Maybe should have just counted file totals - group subtotals don't seem to be that useful.
// Should have defined the problem better, but it's ok, did not add too much complexity.

const results = new Result();
const groupStack = [];
let logToConsole = true;
let inside = null; // maybe could refactor by adding adding type to Result, and checking parent type
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
  results.error = 0;
  results.total = 0;
  results.status = undefined;
  results.details = {};
  clearState();
}

function clearState() {
  inside = null;
  groupStack.length = 0;
}

export function describe(groupName, groupFunction) {
  checkForName(groupName);
  checkForGenericErrors(describe.name, groupFunction);
  const parentGroup = groupStack[groupStack.length - 1] || results;
  // if results, then handle top level describe
  checkForDuplicates(describe.name, groupName, parentGroup.details);

  if (logToConsole)
    consoleLogger.logGroupName(groupName, '  '.repeat(groupStack.length));

  groupStack.push(parentGroup.details[groupName] = new Result());
  if (parentGroup.beforeEach) parentGroup.beforeEach();
  groupFunction();
  if (parentGroup.afterEach) parentGroup.afterEach();
  groupStack.pop();
  updateParentResults(parentGroup, parentGroup.details[groupName]);
  //if (groupStack.length === 0 && logToConsole) consoleLogger.logTotals(results);
  // log file totals when running from test runner
};

export function it(specName, specFunction) {
  checkForName(specName);
  checkForGenericErrors(it.name, specFunction);
  const group = getParentGroup(it.name);
  checkForDuplicates(it.name, specName, group.details);
  inside = it.name;
  const result = testSpec(group, specFunction);
  group.details[specName] = result;
  group[result.status] += 1;
  group.status = determineGroupStatus(group);

  if (logToConsole)
    consoleLogger.logSpecResult(
      group.details[specName],
      specName,
      '  '.repeat(groupStack.length)
    );

  inside = null;
  group.total += 1;
};

export function beforeEach(setupFunction) {
  onEach(beforeEach.name, setupFunction);
}

export function afterEach(teardownFunction) {
  onEach(afterEach.name, teardownFunction);
}

function onEach(name, func) {
  checkForGenericErrors(name, func);
  const parentGroup = getParentGroup(name);
  checkForDuplicates(name, undefined, parentGroup);
  parentGroup[name] = () => {
    inside = name;
    func();
    inside = null;
  };
}

function testSpec(group, specFunction) {
  try {
    if (group.beforeEach) group.beforeEach();
    specFunction();
    if (group.afterEach) group.afterEach();
    return { status: 'passed' };
  } catch(error) {
    if (error instanceof StructureError) resetAndThrow(error);
    if (error instanceof ArgumentTypeError) resetAndThrow(error);
    if (error instanceof AsyncError) resetAndThrow(error);
    if (error instanceof Error) return { status: 'error', error: error };
    return { status: 'failed', output: error };
  }
}

function determineGroupStatus(group) {
  if (group.error > 0) return 'error';
  if (group.failed > 0) return 'failed';
  if (group.passed === group.total) return 'passed';
  return 'pending'; // this is not really a status, but it is used for logging, maybe
}

// will want to move these to a separate file, together with splitting the test file
function checkForName(name) {
  if (!name || typeof name !== 'string') {
    resetAndThrow(new ArgumentTypeError('string', typeof name));
  }
}

function checkForGenericErrors(functionName, func) {
  if (inside) {
    resetAndThrow(new StructureError(`'${functionName}' cannot be nested inside '${inside}'.`));
  }
  if (!func || typeof func !== 'function') {
    resetAndThrow(new ArgumentTypeError('function', typeof func));
  }
  if (func.constructor.name === 'AsyncFunction') {
    resetAndThrow(new AsyncError());
  }
}

function getParentGroup(functionName) {
  const parentGroup = groupStack[groupStack.length - 1];
  if (!parentGroup) {
    resetAndThrow(new StructureError(`'${functionName}' must have 'describe' as parent.`));
  }
  return parentGroup;
}

function checkForDuplicates(functionName, groupName = '', groupDetails) {
  const errorMessage = `'${functionName}(${groupName})' already exists in this group.`;
  if (!groupName && functionName in groupDetails) {
    resetAndThrow(new StructureError(errorMessage));
  }
  if (groupName in groupDetails) {
    resetAndThrow(new StructureError(errorMessage));
  }
}

function resetAndThrow(error) {
  clearState();
  throw error;
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
export default { describe, it, beforeEach, afterEach, getResults, setLogToConsole, clearResults, StructureError, ArgumentTypeError };
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