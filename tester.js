import consoleLogger from './consoleLogger.js';

const results = {};
const groupStack = [];
const logToConsole = true;

// tester is core, should not care about output types. But real life is messy, so here we are.
// in this case, for a test framework, smooth consumer experience is absolutely essential,
// so better to leave a dependency rather than overengineer and add extra baggage for consumer.
// why not have both? expose the abstraction
// currently, dont see any gains for the additional complexity.
// if at any point potential gains become apparent, will refactor.

function setLogToConsole(newLogToConsole) {
  logToConsole = newLogToConsole;
}

function getResults() {
  return results;
}

function describe(groupName, callback) {
  const group = groupStack.length > 0 ?
    (groupStack[groupStack.length - 1][groupName] = {}) :
    (results[groupName] = {});
  groupStack.push(group);
  if (logToConsole) consoleLogger.logGroupName(groupName, '  '.repeat(groupStack.length - 1));
  callback();
  groupStack.pop();
}

function it(specName, callback) {
  const group = groupStack[groupStack.length - 1];
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
}

export default { describe, it, getResults, setLogToConsole }; // this is for one file only.

// will want to switch outputs to file, maybe even to browser, or just another service.

// DONE use case 1 - log the output (as you go)
// use case 2 - save the output to file (all at once, or maybe also as you go?)
// need to be able to turn off one or the other. or both.

// might need serious refactoring, depending on how the multiple file implementation goes.


// middleLayer.js
/*
import testerCore from './testerCore.js';

async function setOutputter(outputterName) {
  const outputter = await import(`./${outputterName}.js`);
  testerCore.setOutputter(outputter);
}

export default { ...testerCore, setOutputter };

*/