import globaler from './globaler.js';
import Result from './resultBuilder.js';
import consoleLogger from './consoleLogger.js';
import { ArgumentTypeError, StructureError, AsyncError } from './errors.js';

class Tester {
  #globalTester;
  #results;
  #logToConsole;
  #groupStack;
  #inside;

  constructor() {
    this.#globalTester = globaler.getGlobalTester();
    this.#results = this.#globalTester.getCurrentFileResults();
    this.#logToConsole = true;
    this.#groupStack = [];
    this.#inside = null;
  }

  setLogToConsole(newLogToConsole) {
    this.#logToConsole = newLogToConsole;
  }

  getResults() {
    return JSON.parse(JSON.stringify(this.#results));
  }

  describe(groupName, groupFunction) {
    this.#checkForName(groupName);
    this.#checkForGenericErrors(describe.name, groupFunction);
    const parentGroup = this.#groupStack[this.#groupStack.length - 1] || this.#results;
    this.#checkForDuplicates(describe.name, groupName, parentGroup.details);
  
    if (this.#logToConsole)
      consoleLogger.logGroupName(groupName, '  '.repeat(this.#groupStack.length));
  
    const currentGroup = new Result();
    parentGroup.details[groupName] = currentGroup;
    this.#groupStack.push(currentGroup);
    if (parentGroup.beforeEach) parentGroup.beforeEach();
    groupFunction();
    if (parentGroup.afterEach) parentGroup.afterEach();
    this.#groupStack.pop();
    parentGroup.updateResults(currentGroup);
    if (groupStack.length === 0) this.#globalTester.updateTotalResults();
  }

  it(specName, specFunction) {
    this.#checkForName(specName);
    this.#checkForGenericErrors(it.name, specFunction);
    const group = this.#getParentGroup(it.name);
    this.#checkForDuplicates(it.name, specName, group.details);
    this.#inside = it.name;
    const specResult = this.#testSpec(group, specFunction);
    group.details[specName] = specResult;
    group[specResult.status] += 1;
    group.updateStatus();
  
    if (this.#logToConsole)
      consoleLogger.logSpecResult(
        group.details[specName],
        specName,
        '  '.repeat(this.#groupStack.length)
      );
  
    this.#inside = null;
    group.total += 1;
  };

  beforeEach(setupFunction) {
    this.#onEach(beforeEach.name, setupFunction);
  }
  afterEach(teardownFunction) {
    this.#onEach(afterEach.name, teardownFunction);
  }
  #onEach(name, func) {
    this.#checkForGenericErrors(name, func);
    const parentGroup = this.#getParentGroup(name);
    this.#checkForDuplicates(name, undefined, parentGroup);
    parentGroup[name] = () => {
      this.#inside = name; // will this work? should because arrow func dont create context
      func();
      this.#inside = null;
    };
  }

  #testSpec(group, specFunction) {
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

  #checkForName(name) {
    if (!name || typeof name !== 'string') {
      this.#resetAndThrow(new ArgumentTypeError('string', typeof name));
    }
  }
  
  #checkForGenericErrors(functionName, func) {
    if (this.#inside) {
      this.#resetAndThrow(new StructureError(`'${functionName}' cannot be nested inside '${this.#inside}'.`));
    }
    if (!func || typeof func !== 'function') {
      this.#resetAndThrow(new ArgumentTypeError('function', typeof func));
    }
    if (func.constructor.name === 'AsyncFunction') {
      this.#resetAndThrow(new AsyncError());
    }
  }
  
  #getParentGroup(functionName) {
    const parentGroup = this.#groupStack[this.#groupStack.length - 1];
    if (!parentGroup) {
      this.#resetAndThrow(new StructureError(`'${functionName}' must have 'describe' as parent.`));
    }
    return parentGroup;
  }
  
  #checkForDuplicates(functionName, groupName = '', groupDetails) {
    const errorMessage = `'${functionName}(${groupName})' already exists in this group.`;
    if (!groupName && functionName in groupDetails) {
      this.#resetAndThrow(new StructureError(errorMessage));
    }
    if (groupName in groupDetails) {
      this.#resetAndThrow(new StructureError(errorMessage));
    }
  }
  
  #resetAndThrow(error) {
    this.states.inside = null;
    this.states.groupStack.length = 0;
    throw error;
  }
}

export default new Tester();

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