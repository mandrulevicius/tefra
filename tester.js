import asserter from './asserter.js';
// should conform to BDD style
// should be able to nest describes

let results = {};
let currentDescription; // this might not work with async

function describe(description, callback) {
  results[description] = {};
  currentDescription = description;
  callback();
}

function it(description, callback) {
  let parent = currentDescription;
  try {
    callback();
    results[parent][description] = { status: 'pass' };
  } catch (error) {
    if (error instanceof Error) {
      results[parent][description] = { status: 'error', error: error };
    } else {
      results[parent][description] = { status: 'fail', error: error };
    }
  }
}

function printResults() {
  console.log(`ETST`);
  console.log(results);
  console.log(`ETST`);
  for (let test in results) {
    console.log(test);
    for (let subtest in results[test]) {
      if (results[test][subtest].status === 'pass') {
        console.log(`  ${subtest}: pass`);
      } else if (results[test][subtest].status === 'fail') {
        console.log(`  ${subtest}: fail`);
        console.log('    ', JSON.stringify(results[test][subtest].error));
      } else {
        console.log(`  ${subtest} -`, results[test][subtest].error);
      }
    }
  }
}
// will want to switch outputs to file, maybe even to browser.

export default { describe, it, printResults };

// maybe later should output results one by one, in a way defined in settings.