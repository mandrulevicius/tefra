import { existsSync, readdirSync, lstatSync, statSync } from 'fs';
// lstatSync and statSync difference is symbolicLinks.
// figure out if relevant.
import { join, basename } from 'path';
import { checkType } from './typeChecker.js';

// what if we want to exclude specific paths, and have duplicate names in different paths?
export function getFiles(targetPath = './', extension = '.js', excludedNames = []) {
  checkType(targetPath, 'string');
  checkType(excludedNames, 'array');
  excludedNames.forEach(name => checkType(name, 'string'));
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

function getFilesFromDir(targetDirPath, extension, excludedNames) { // Recursive
  let fileNames = [];
  readdirSync(targetDirPath).forEach(name => { // this is synchronous loop, may impact performance
    if (excludedNames.includes(name)) return;
    const fullPath = join(targetDirPath, name);
    if (lstatSync(fullPath).isDirectory()) {
      fileNames = fileNames.concat(getFilesFromDir(fullPath, extension, excludedNames));
    } else if (fullPath.endsWith(extension)) fileNames.push(fullPath);
  });
  return fileNames;
}

export default { getFiles };