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
      details: this.#details
    };
  }

  getChild(name) {
    return this.#details[name];
  }

  addChild(name) {
    this.#details[name] = new Result(name, this);
    return this.#details[name];
  }

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
