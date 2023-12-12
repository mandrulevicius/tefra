import pathReader from './pathReader.js';
import './asserter.js';
import tester from './tester.js';
// THIS ARE NOT LIKE THE OTHERS? - maybe logical split
import consoleLogger from './consoleLogger.js';

// if any tests fail, maybe should throw results afterwards? (for pipelines)

async function runTests(targetPath, excludedNames) {
  const jsFiles = pathReader.getTestFiles(targetPath, excludedNames);
  
  if (!jsFiles) throw new Error(`No file or directory with path '${targetPath}'`);
  if (jsFiles.length === 0) throw new Error(`No valid files found in path '${targetPath}'`);

  for (const testFile of jsFiles) {
    // really want to add them to queue rather than run right now
    tester.initFileTest(testFile);
    console.log('Testing file:', testFile);
    await import(testFile);
    tester.updateResults();
    // log file totals
  }
  const results = getResults();
  tester.clearResults();
  //const results = globalTester.run(); // async?
  consoleLogger.logResults(results);
  return results;
}


export default { runTests };
