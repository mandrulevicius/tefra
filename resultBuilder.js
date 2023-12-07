class Result {
  constructor(status, passed = 0, failed = 0, error = 0, total = 0, details = {}) {
    this.status = status;
    this.passed = passed;
    this.failed = failed;
    this.error = error;
    this.total = total;
    this.details = details;
    // TODO make private, access only through setters and getters
    // later add parent, maybe name
  }

  updateResults(child) {
    this.passed += child.passed;
    this.failed += child.failed;
    this.error += child.error;
    this.total += child.total;
    this.updateStatus();
  }
  // Maybe should have just counted file totals - group subtotals don't seem to be that useful.
  // Should have defined the problem better, but it's ok, did not add too much complexity.
  // BEFORE TRYING TO CREATE A FULL STRUCTURE FOR ALL FILES, SEE IF WONT BE EASIER TO JUST SUM IT UP.

  updateStatus() {
    if (this.passed === this.total) this.status = 'pass';
    if (this.failed > 0) this.status = 'fail';
    if (this.error > 0) this.status = 'error';
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
