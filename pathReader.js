import { existsSync, readdirSync, lstatSync, statSync } from 'fs';
// lstatSync and statSync difference is symbolicLinks.
// figure out if relevant.
import { join, basename } from 'path';
import { ArgumentTypeError } from './errors';

function getTestFiles(targetPath = './', customExcludedNames = []) {
  if (typeof targetPath !== 'string')
    throw new ArgumentTypeError('string', typeof targetPath);
  if (!Array.isArray(customExcludedNames)) {
    throw new ArgumentTypeError('array', typeof customExcludedNames);
  }
  customExcludedNames.forEach(name => {
    if (typeof name !== 'string')
      throw new ArgumentTypeError('string', typeof name);
  });

  const targetExtension = '.test.js';
  const defaultExcludedNames = ['node_modules', '.git'];
  const excludedNames = defaultExcludedNames.concat(customExcludedNames);
  // THIS FUNCTION DOES A BIT TOO MUCH BY ITSELF
  if (!existsSync(targetPath))
    throw new Error(`No file or directory with path '${targetPath}'`);
  if (excludedNames.includes(basename(targetPath)))
    throw new Error(`'${targetPath}' is excluded`);
  if (!statSync(targetPath).isDirectory()) {
    if (targetPath.endsWith(targetExtension)) return [targetPath];
    else throw new Error(`Invalid file '${targetPath}', expected '*${targetExtension}'`);
  }
  const fileNames = getTestFilesFromDir(targetPath, excludedNames);
  if (fileNames.length === 0) throw new Error(`No valid files found in path '${targetPath}'`);
  return fileNames;
}

function getTestFilesFromDir(targetDirPath, excludedNames) { // RECURSIVE
  let fileNames = [];
  readdirSync(targetDirPath).forEach(file => {
    if (excludedNames.includes(file)) return;
    const fullPath = join(targetDirPath, file);
    if (lstatSync(fullPath).isDirectory()) {
      fileNames = fileNames.concat(getTestFilesFromDir(fullPath, excludedNames));
    } else if (fullPath.endsWith(targetExtension)) fileNames.push(fullPath);
  });
  return fileNames;
}

function checkArray(arr) {


  for (const item of arr) {
    if (typeof item !== 'string') {
      throw new Error('Array must only contain strings');
    }
  }
}

export default { getTestFiles };