import asserter from './asserter.js';
// should conform to BDD style
// should be able to nest describes

let results = {};
let currentGroupName; // this might not work with async

function describe(groupName, callback) {
  results[groupName] = {};
  currentGroupName = groupName;
  callback();
  console.log(groupName);
  printGroupResult(results[groupName]);
}

function it(specName, callback) {
  let groupName = currentGroupName; // this might be needed to prevent async problems
  try {
    callback();
    results[groupName][specName] = { status: 'pass' }; // double brackets
  } catch (error) {
    if (error instanceof Error) {
      results[groupName][specName] = { status: 'error', error: error };
    } else {
      results[groupName][specName] = { status: 'fail', error: error };
    }
  }
}

function printAllResults() {
  console.log(`TEST OBJECT`);
  console.log(results);
  console.log(`END TEST OBJECT`);
  for (const groupName in results) {
    console.log(groupName);
    printGroupResult(results[groupName]);
  }
}

function printGroupResult(group) {
  for (let specName in group) {
    printSpecResult(group[specName], specName);
  }
}

function printSpecResult(spec, specName) {
  if (spec.status === 'pass') {
    console.log(`  ${specName}: pass`);
  } else if (spec.status === 'fail') {
    console.log(`  ${specName}: fail`);
    console.log('    ', JSON.stringify(spec.error));
  } else {
    console.log(`  ${specName} -`, spec.error);
  }
}

export default { describe, it, printAllResults };

// will want to switch outputs to file, maybe even to browser, or just another service.