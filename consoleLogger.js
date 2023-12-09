function logGroupName(groupName, indent = '') {
  console.log(`${indent}${groupName}`);
}

function logSpecResult(spec, specName, indent = '') {
  if (spec.status === 'passed') {
    console.log(`${indent}[+] ${specName}`);
  } else if (spec.status === 'failed') {
    console.log(`${indent}[-] ${specName}`);
    console.log(`${indent}  `, `Actual: ${JSON.stringify(spec.output.actual)}`);
    console.log(`${indent}  `, `Expect: ${JSON.stringify(spec.output.expected)}`);
  } else {
    console.log(`${indent}[x] ${specName} -`, spec.error);
  }
}

function logResults(results) {
  console.log(``);
  console.log(`Status: ${results.status}`);
  console.log(`  Passed: ${results.passed}`);
  console.log(`  Failed: ${results.failed}`);
  console.log(`  Error: ${results.error}`);
  console.log(`  Total: ${results.total}`);
}

export default { logGroupName, logSpecResult, logResults };

// TODO use or delete after multiple file implementation is done
// POSSIBLY NEEDED CODE
// function logAllResults() {
//   for (const groupName in results) {
//     logGroupResult(results[groupName], groupName);
//   }
// }

// function logGroupResult(group, groupName, indent = '') {
//   console.log(`${indent}${groupName}`);
//   for (const specName in group) {
//     if (typeof group[specName] === 'object' && group[specName].status) {
//       logSpecResult(group[specName], specName, `${indent}  `);
//     } else {
//       logGroupResult(group[specName], specName, `${indent}  `);
//     }
//   }
// }