class Result {
  #name;
  #parent;
  #status;
  #passed;
  #failed;
  #error;
  #total;
  #duration;
  #details;

  constructor(name, parent) {
    this.#name = name;
    this.#parent = parent;
    this.#status = null;
    this.#passed = 0;
    this.#failed = 0;
    this.#error = 0;
    this.#total = 0;
    this.#duration = 0;
    this.#details = {};
  }

  get name() {
    return this.#name;
  }

  get totals() {
    return {
      status: this.#status,
      passed: this.#passed,
      failed: this.#failed,
      error: this.#error,
      total: this.#total,
      duration: this.#duration
    };
  }

  get details() {
    return this.#details;
  }

  /**
   * Returns an object containing the full results.
   * 
   * @returns {Object} Includes name, parent, status totals, duration, and child results in details
   */
  getResults() {
    return {
      name: this.#name,
      parent: this.#parent,
      status: this.#status,
      passed: this.#passed,
      failed: this.#failed,
      error: this.#error,
      total: this.#total,
      duration: this.#duration,
      details: this.#details,
    };
  }

  /**
   * Gets the child result with the given name from the details object.
   *
   * @param {string} name - The name of the child result to get
   * @returns {Result} The child result object
   */
  getChild(name) {
    return this.#details[name];
  }

  /**
   * Adds a new child result with the given name.
   *
   * Creates a new Result instance, adds it to the details object,
   * and returns the new Result instance.
   *
   * @param {string} name - The name of the new child result
   * @returns {Result} The new Result instance that was created and added
   */
  addChild(name) {
    this.#details[name] = new Result(name, this);
    return this.#details[name];
  }

  /**
   * Removes the child result with the given name.
   *
   * Updates the parent result totals by subtracting the
   * child result totals. Removes the child details object.
   * Updates the parent status after removing the child.
   *
   * @param {string} name - The name of the details object to remove
   */
  removeChild(name) {
    const childTotals = this.#details[name].totals;
    this.#passed -= childTotals.passed;
    this.#failed -= childTotals.failed;
    this.#error -= childTotals.error;
    this.#total -= childTotals.total;
    this.#duration -= childTotals.duration;
    delete this.#details[name];
    this.#updateStatus();
  }

  /**
   * Adds a spec result to the details object.
   *
   * @param {string} name - The name of the spec result to add
   * @param {Object} specResult - The spec result object to add
   *
   * The spec result object will be added to the details object,
   * and the totals will be updated based on the status of the
   * spec result.
   */
  addSpecResult(name, specResult) {
    this.#details[name] = { name, ...specResult };
    this.#updateResult(specResult);
  }

  #updateResult(specResult) {
    if (specResult.status === 'passed') this.#passed += 1;
    if (specResult.status === 'failed') this.#failed += 1;
    if (specResult.status === 'error') this.#error += 1;
    this.#duration += specResult.duration;
    this.#total += 1;
    this.#updateStatus();
    if (this.#parent) this.#parent.#updateResult(specResult);
  }

  #updateStatus() {
    if (this.#passed === this.#total) this.#status = 'pass';
    if (this.#failed > 0) this.#status = 'fail';
    if (this.#error > 0) this.#status = 'error';
  }

  // Maybe should have just counted file totals - group subtotals don't seem to be that useful.
  // Should have defined the problem better, but it's ok, did not add too much complexity.
  // BEFORE TRYING TO CREATE A FULL STRUCTURE FOR ALL FILES, SEE IF WONT BE EASIER TO JUST SUM IT UP.

}

export default Result;
