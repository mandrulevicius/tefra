import { existsSync, readdirSync, lstatSync, statSync } from 'fs';
// lstatSync and statSync difference is symbolicLinks.
// figure out if relevant.
import { join, basename } from 'path';
import { checkType } from './typeChecker.js';

const defaultExcludedNames = ['node_modules', '.git'];

export function getFiles(targetPath = './', extension = '.js', customExcludedNames = []) {
  checkType(targetPath, 'string');
  checkType(customExcludedNames, 'array');
  customExcludedNames.forEach(name => checkType(name, 'string'));

  const excludedNames = defaultExcludedNames.concat(customExcludedNames);
  const isDirectory = checkPath(targetPath, excludedNames);
  if (!isDirectory) return getFile(targetPath, extension);
  const fileNames = getFilesFromDir(targetPath, extension, excludedNames);
  if (fileNames.length === 0) throw new Error(`No valid files found in path '${targetPath}'`);
  return fileNames;
}

function checkPath(targetPath, excludedNames) {
  if (!existsSync(targetPath)) {
    throw new Error(`No file or directory with path '${targetPath}'`);
  }
  if (excludedNames.includes(basename(targetPath))) {
    throw new Error(`'${targetPath}' is excluded`);
  }
  return statSync(targetPath).isDirectory();
}

function getFile(targetPath, extension) {
  if (targetPath.endsWith(extension)) return [targetPath];
  else throw new Error(`Invalid file '${targetPath}', expected '*${extension}'`);
}

function getFilesFromDir(targetDirPath, extension, excludedNames) { // RECURSIVE
  let fileNames = [];
  readdirSync(targetDirPath).forEach(name => {
    if (excludedNames.includes(name)) return;
    const fullPath = join(targetDirPath, name);
    if (lstatSync(fullPath).isDirectory()) {
      fileNames = fileNames.concat(getFilesFromDir(fullPath, excludedNames));
    } else if (fullPath.endsWith(extension)) fileNames.push(fullPath);
  });
  return fileNames;
}

export default { getFiles };