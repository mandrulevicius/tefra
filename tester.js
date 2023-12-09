import Result from './resultBuilder.js';
import consoleLogger from './consoleLogger.js';
import { ArgumentTypeError, StructureError, AsyncError } from './errors.js';

let results = new Result();
let logToConsole = true;
const groupStack = [];
let inside = null;
let currentFile = null;

function initFileTest(fileName) {
  clearState();
  currentFile = fileName;
  results.details[currentFile] = new Result();
}

function clearState() {
  groupStack.length = 0;
  inside = null;
}

function updateResults() {
  results.update(results.details[currentFile]);
}

function getResults() {
  return JSON.parse(JSON.stringify(results));
}

function clearResults() {
  results = new Result();
}

function setLogToConsole(newLogToConsole) {
  logToConsole = newLogToConsole;
}

function describe(groupName, groupFunction) {
  checkForName(groupName);
  checkForGenericErrors(describe.name, groupFunction);
  const parentGroup = groupStack[groupStack.length - 1] || results.details[currentFile];
  checkForDuplicates(describe.name, groupName, parentGroup.details);

  if (logToConsole)
    consoleLogger.logGroupName(groupName, '  '.repeat(groupStack.length));

  const currentGroup = new Result();
  parentGroup.details[groupName] = currentGroup;
  groupStack.push(currentGroup);
  if (parentGroup.beforeEach) parentGroup.beforeEach();
  groupFunction();
  if (parentGroup.afterEach) parentGroup.afterEach();
  groupStack.pop();
  parentGroup.update(currentGroup);
}

function it(specName, specFunction) {
  checkForName(specName);
  checkForGenericErrors(it.name, specFunction);
  const group = getParentGroup(it.name);
  checkForDuplicates(it.name, specName, group.details);
  inside = it.name;
  const specResult = testSpec(group, specFunction);
  group.details[specName] = specResult;
  group[specResult.status] += 1;
  group.updateStatus();

  if (logToConsole)
    consoleLogger.logSpecResult(
      group.details[specName],
      specName,
      '  '.repeat(groupStack.length)
    );

  inside = null;
  group.total += 1;
};

function beforeEach(setupFunction) {
  onEach(beforeEach.name, setupFunction);
}
function afterEach(teardownFunction) {
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
    if (error instanceof StructureError) throw error;
    if (error instanceof ArgumentTypeError) throw error;
    if (error instanceof AsyncError) throw error;
    if (error instanceof Error) return { status: 'error', error: error };
    return { status: 'failed', output: error };
  }
}

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

global.describe = describe;
global.it = it;
global.beforeEach = beforeEach;
global.afterEach = afterEach;
global.setLogToConsole = setLogToConsole; // should prob remove this

export default { initFileTest, updateResults, getResults, clearResults };

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