import { getFiles } from './pathReader.js';
import './asserter.js';
import tester from './tester.js';
import consoleLogger from './consoleLogger.js';

// if any tests fail, maybe should throw results afterwards? (for pipelines)

const defaultExcludedNames = ['node_modules', '.git'];
const defaultPath = 'test';

/**
 * Runs all test files in the given target path, excluding files/folders in the excludedNames array.
 * Imports and runs each test file, logs the results, and returns the aggregated test results.
 *
 * @param {string} [customTargetPath] - Path to look for test files in. Defaults to 'test'.
 * @param {string[]} [customExcludedNames] - Additional names of files/folders to exclude from test run.
 * @returns {Object} The aggregated results from running all test files.
 */
async function runTests(customTargetPath, customExcludedNames = []) {
  // get targetPath from command line args, excludedNames from setup?
  const targetPath = customTargetPath ?? defaultPath;
  const excludedNames = defaultExcludedNames.concat(customExcludedNames);
  const jsFiles = getFiles(targetPath, '.test.js', excludedNames);
  for (const testFile of jsFiles) {
    // really want to add them to queue rather than run right now
    tester.initFileTest(testFile);
    await import('./' + testFile);
    consoleLogger.logFileResults(getResults(testFile));
  }
  const results = getResults();
  tester.clearResults();
  //const results = globalTester.run(); // async?
  consoleLogger.logTotals(results);
  return results;
}

export default { runTests };
