import Result from "./resultBuilder.js";

class GlobalTester {
  #results = new Result();
  #currentFile;
  setCurrentFile(filePath) {
    this.#currentFile = filePath;
    this.#results.details[filePath] = new Result();
  }

  getCurrentFileResults() {
    return this.#results.details[this.#currentFile];
  }

  updateTotalResults() {
    this.#results.updateResults(this.#results.details[this.#currentFile]);
  }

  getResults(filePath) {
    return filePath ? this.#results.details[filePath] : this.#results;
  }
}

export function buildGlobal() {
  if (global.tester) throw new Error('global.tester already defined');
  global.tester = new GlobalTester();
  return global.tester;
}
// modifying the global through setter mitigates the global variable issues
// if need to debug, track function calls

export function getGlobalTester() {
  return global.tester;
}

export default { buildGlobal, getGlobalTester };