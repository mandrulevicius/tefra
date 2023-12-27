import Result from './resultBuilder.js';
import { ArgumentTypeError, StructureError, AsyncError } from './errors.js';
import { attachGlobal } from './globalizer.js';

let results = new Result('root');
const groupStack = [];
let inside = null;
let currentFile = null;

/**
 * Initializes the test state for a new test file.
 * Clears the test state, sets the current test file name,
 * and adds the file as a child to the root test results.
 *
 * @param {string} fileName - The name of the test file being initialized
 */
function initFileTest(fileName) {
  clearState();
  currentFile = fileName;
  results.addChild(currentFile);
}

/**
 * Clears the test results for a given file name.
 * If no file name is provided, clears all test results and resets to initial state.
 * If a file name is provided, removes only that file's results.
 */
function clearResults(fileName) {
  if (!fileName) results = new Result('root');
  else results.removeChild(fileName);
}

function clearState() {
  groupStack.length = 0;
  inside = null;
}

/**
 * Gets the test results for a given test file.
 * If no file is provided, returns the root test results.
 * If a file is provided, returns the results for that specific file.
 */
function getResults(testFile) {
  if (!testFile) return results.getResults();
  return results.getChild(testFile).getResults();
}

/**
 * Creates a test group with the given name and runs the callback function to
 * define tests within that group. Handles setup/teardown at the group level.
 *
 * @param {string} groupName - The name of the test group
 * @param {Function} groupFunction - The callback function that defines tests in the group
 */
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


/**
 * Defines a test spec with the given name and runs the callback
 * function to execute the spec. Handles setup/teardown at the spec level.
 *
 * @param {string} specName - The name of the test spec
 * @param {Function} specFunction - The callback function that runs the test spec
 */
function test(specName, specFunction) {
  checkForName(specName);
  checkForGenericErrors(test.name, specFunction);
  const group = getParentGroup(test.name);
  checkForDuplicates(test.name, specName, group.details);
  inside = test.name;
  const specResult = testSpec(group, specFunction);
  group.addSpecResult(specName, specResult);
  inside = null;
}

/**
 * Registers a setup function to run before each test in the current
 * test group. The setupFunction will run before each test group or spec.
 *
 * @param {Function} setupFunction - The setup function to run before each test.
 */
function beforeEach(setupFunction) {
  onEach(beforeEach.name, setupFunction);
}
/**
 * Registers a teardown function to run after each test in the current
 * test group. The teardownFunction will run after each test group or spec.
 *
 * @param {Function} teardownFunction - The teardown function to run after each test.
 */
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

attachGlobal(describe);
attachGlobal(test);
attachGlobal(beforeEach);
attachGlobal(afterEach);
attachGlobal(getResults);

export default { initFileTest, clearResults };

// DESIGN:
// should think about how to restructure this. 
// this cares too much about files.
// tester should just test and produce result.
// testRunner should just run files and collect results.
// testRunner should clear results after each file?
// CURRENTLY NOT SURE WHAT STRUCTURE WOULD BE BETTER
// issue might solve itself with rework for async support