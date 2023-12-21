import { getFiles } from './pathReader.js';
import './asserter.js';
import tester from './tester.js';
import consoleLogger from './consoleLogger.js';

// if any tests fail, maybe should throw results afterwards? (for pipelines)

const defaultExcludedNames = ['node_modules', '.git'];
const defaultPath = 'test';

// get targetPath from command line args, excludedNames from setup?
async function runTests(customTargetPath, customExcludedNames = []) {
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
