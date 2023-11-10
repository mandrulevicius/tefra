const results = {};
const groupStack = [];

function describe(groupName, callback) {
  const group = groupStack.length > 0 ? (groupStack[groupStack.length - 1][groupName] = {}) : (results[groupName] = {});
  groupStack.push(group);
  printGroupName(groupName, '  '.repeat(groupStack.length - 1));
  callback();
  groupStack.pop();
}

function it(specName, callback) {
  const group = groupStack[groupStack.length - 1];
  try {
    callback();
    group[specName] = { status: 'pass' };
  } catch (error) {
    if (error instanceof Error) {
      group[specName] = { status: 'error', error: error };
    } else {
      group[specName] = { status: 'fail', error: error };
    }
  }
  printSpecResult(group[specName], specName, '  '.repeat(groupStack.length));
}

function getResults() {
  return results;
}

function printGroupName(groupName, indent = '') {
  console.log(`${indent}${groupName}`);
}

// function printAllResults() {
//   console.log(`TEST OBJECT`);
//   console.log(results);
//   console.log(`END TEST OBJECT`);
//   for (const groupName in results) {
//     printGroupResult(results[groupName], groupName);
//   }
// }

// function printGroupResult(group, groupName, indent = '') {
//   console.log(`${indent}${groupName}`);
//   for (const specName in group) {
//     if (typeof group[specName] === 'object' && group[specName].status) {
//       printSpecResult(group[specName], specName, `${indent}  `);
//     } else {
//       printGroupResult(group[specName], specName, `${indent}  `);
//     }
//   }
// }

function printSpecResult(spec, specName, indent = '') {
  if (spec.status === 'pass') {
    console.log(`${indent}${specName}: pass`);
  } else if (spec.status === 'fail') {
    console.log(`${indent}${specName}: fail`);
    console.log(`${indent}  `, JSON.stringify(spec.error));
  } else {
    console.log(`${indent}${specName} -`, spec.error);
  }
}

// move printer to different file

export default { describe, it, getResults }; // this is for one file only.

// will want to switch outputs to file, maybe even to browser, or just another service.

// use case 1 - log the output (as you go)
// use case 2 - save the output to file (all at once)
// use case 3 - return the object