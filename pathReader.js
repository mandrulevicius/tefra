import { existsSync, readdirSync, statSync } from 'fs';
import { join, basename } from 'path';
import { checkType } from './typeChecker.js';

/**
 * Retrieves all files with the given file extension recursively in the given path,
 * excluding any files and folders in the excludedNames array.
 *
 * @param {string} targetPath - The path to search in
 * @param {string} extension - The file extension to match
 * @param {string[]} excludedNames - File names to exclude
 * @returns {string[]} Array of matching file paths
 * @throws {Error} If no valid files are found
 */
export function getFiles(targetPath = './', extension = '.js', excludedNames = []) {
  checkType(targetPath, 'string');
  checkType(excludedNames, 'array');
  excludedNames.forEach(name => checkType(name, 'string'));
  const isDirectory = checkPath(targetPath, excludedNames);
  if (!isDirectory) return getFile(targetPath, extension);
  const files = getFilesFromDir(targetPath, extension, excludedNames);
  if (files.length === 0) throw new Error(`No valid files found in path '${targetPath}'`);
  return files;
}
// what if we want to exclude specific paths, and have duplicate names in different paths?
// TODO add option to exclude full paths rather than names

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
  let files = [];
  readdirSync(targetDirPath).forEach(name => { // this is synchronous loop, may impact performance
    if (excludedNames.includes(name)) return;
    const fullPath = join(targetDirPath, name);
    if (statSync(fullPath).isDirectory()) {
      files = files.concat(getFilesFromDir(fullPath, extension, excludedNames));
    } else if (fullPath.endsWith(extension)) files.push(fullPath);
  });
  return files;
}

export default { getFiles };