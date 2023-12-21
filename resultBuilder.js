class Result {
  #parent;
  #status;
  #passed;
  #failed;
  #error;
  #total;
  #duration;
  #details;

  constructor(parent) {
    this.#parent = parent;
    this.#status = null;
    this.#passed = 0;
    this.#failed = 0;
    this.#error = 0;
    this.#total = 0;
    this.#duration = 0;
    this.#details = {};
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
    this.#details[name] = new Result(this);
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

  addSpecResult(specName, specResult) {
    this.#details[specName] = specResult;
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

  // Maybe should have just counted file totals - group subtotals don't seem to be that useful.
  // Should have defined the problem better, but it's ok, did not add too much complexity.
  // BEFORE TRYING TO CREATE A FULL STRUCTURE FOR ALL FILES, SEE IF WONT BE EASIER TO JUST SUM IT UP.

  #updateStatus() {
    if (this.#passed === this.#total) this.#status = 'pass';
    if (this.#failed > 0) this.#status = 'fail';
    if (this.#error > 0) this.#status = 'error';
  }

  //test what was going on with this
// function determineGroupStatus(group) {
//   if (group.error > 0) return 'error';
//   if (group.failed > 0) return 'failed';
//   if (group.passed === group.total) return 'passed'; // WHY IS STATUS PENDING??
//   return 'pending'; // this is not really a status, but it is used for logging, maybe
// }

  // updateResults(parent, result) {
  //   this[result.status] += 1;
  //   this.status = determineGroupStatus(group);

  //   parent.updateResults() // how to get next level parent?
  //   // maybe shouldnt complicate it, leave fanciness for later
  // }
}

export default Result;
