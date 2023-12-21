import Result from './resultBuilder.js';
import { ArgumentTypeError, StructureError, AsyncError } from './errors.js';

let results = new Result('root');
const groupStack = [];
let inside = null;
let currentFile = null;

function initFileTest(fileName) {
  clearState();
  currentFile = fileName;
  results.addChild(currentFile);
}

function clearState() {
  groupStack.length = 0;
  inside = null;
}

function getResults(testFile) {
  if (!testFile) return results.getResults();
  return results.getChild(testFile).getResults();
}

function clearResults(fileName) {
  if (!fileName) results = new Result('root');
  else results.removeChild(fileName);
}

function describe(groupName, groupFunction) {
  checkForName(groupName);
  checkForGenericErrors(describe.name, groupFunction);
  const parentGroup = groupStack[groupStack.length - 1] || results.getChild(currentFile);
  checkForDuplicates(describe.name, groupName, parentGroup.details);
  const currentGroup = parentGroup.addChild(groupName);
  groupStack.push(currentGroup);
  if (parentGroup.beforeEach) parentGroup.beforeEach();
  groupFunction();
  if (parentGroup.afterEach) parentGroup.afterEach();
  groupStack.pop();
}

function it(specName, specFunction) {
  checkForName(specName);
  checkForGenericErrors(it.name, specFunction);
  const group = getParentGroup(it.name);
  checkForDuplicates(it.name, specName, group.details);
  inside = it.name;
  const specResult = testSpec(group, specFunction);
  group.addSpecResult(specName, specResult);
  inside = null;
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
  const beforeTime = performance.now();
  try {
    if (group.beforeEach) group.beforeEach();
    specFunction();
    if (group.afterEach) group.afterEach();
    const afterTime = performance.now();
    return { status: 'passed', duration: afterTime - beforeTime };
  } catch(error) {
    const afterTime = performance.now();
    const duration = afterTime - beforeTime;
    if (error instanceof StructureError) throw error;
    if (error instanceof ArgumentTypeError) throw error;
    if (error instanceof AsyncError) throw error;
    if (error instanceof Error) return { status: 'error', error, duration };
    return { status: 'failed', output: error, duration };
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

function attachGlobal(func) {
  if (global[func.name]) throw new Error(`Global already contains ${func.name}`);
  global[func.name] = func;
}

attachGlobal(describe);
attachGlobal(it);
attachGlobal(beforeEach);
attachGlobal(afterEach);
attachGlobal(getResults);

export default { initFileTest, clearResults };

// DESIGN:
// tester is core, should not care about output types. But real life is messy, so here we are.
// in this case, for a test framework, smooth consumer experience is absolutely essential,
// so better to leave a dependency rather than overengineer and add extra baggage for consumer.
// Why not have both? expose the abstraction?
// currently, dont see any gains for the additional complexity.
// if at any point potential gains become apparent, will refactor.

// DESIGN:
// should think about how to restructure this. 
// this cares too much about files.
// tester should just test and produce result.
// testRunner should just run files and collect results.
// testRunner should clear results after each file?
// CURRENTLY NOT SURE WHAT STRUCTURE WOULD BE BETTER