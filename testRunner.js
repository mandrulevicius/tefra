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
  
  // maybe should not log directly to console
  // maybe should respect the logToConsole flag
  // maybe logToConsole should be global

  for (const testFile of jsFiles) {
    // really want to add them to queue rather than run right now
    tester.initFileTest(testFile);
    console.log('\nTesting file:', testFile);
    await import('./' + testFile);
    consoleLogger.logResults(getResults().details[testFile]);
    tester.updateResults();
  }
  const results = getResults();
  tester.clearResults();
  //const results = globalTester.run(); // async?
  console.log('\n~~~ Total Results ~~~');
  consoleLogger.logResults(results);
  return results;
}

export default { runTests };
