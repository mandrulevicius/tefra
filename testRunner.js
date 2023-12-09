import { existsSync, readdirSync, lstatSync, statSync } from 'fs';
// lstatSync and statSync difference is symbolicLinks.
// figure out if relevant.
import { join } from 'path';
import tester from './tester.js';
import consoleLogger from './consoleLogger.js';

// import tester or directly access global?
// first do what is more simple, will refactor later if necessary.

async function runTests(targetPath = './', excludedDirs = []) {
  const defaultExcludedDirs = ['node_modules', '.git'];
  const jsFiles = getJsFiles(`${targetPath}`, defaultExcludedDirs.concat(excludedDirs));
  
  // this is due to bad input by user
  if (!jsFiles) return { pass: null, error: `No file or directory with path '${targetPath}'` };
  if (jsFiles.length === 0) return { pass: null, error: `No valid files found in path '${targetPath}'` };
  // TODO cleanup hardcoded error text, use better system for input exceptions
  for (const testFile of jsFiles) {
    // really want to add them to queue rather than run right now
    tester.initFileTest(testFile);
    await import('./' + testFile);
    tester.updateResults();
  }
  const results = tester.getResults();
  //const results = globalTester.run(); // async?
  console.log('Total results', results);
  consoleLogger.logTotals(results);
}

function getJsFiles(targetPath, excludedDirs) {
  // THIS FUNCTION DOES A BIT TOO MUCH BY ITSELF
  // since this is recursive, feels redundant to check existence.
  if (!existsSync(targetPath)) return;
  if (!statSync(targetPath).isDirectory()) if (targetPath.endsWith('.test.js')) return [targetPath];
  // what if target is a file, but not a .js. should return error.
  let fileNames = [];
  readdirSync(targetPath).forEach(file => {
      if (excludedDirs.includes(file)) return;
      const fullPath = join(targetPath, file);
      if (lstatSync(fullPath).isDirectory()) {
        fileNames = fileNames.concat(getJsFiles(fullPath, excludedDirs)); // RECURSION!
      } else if (fullPath.endsWith('.test.js')) fileNames.push(fullPath);
  });
  return fileNames;
}

export default { runTests };
