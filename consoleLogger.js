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

function logTotals(totals) {
  console.log(`Status: ${totals.status}`);
  console.log(`Passed: ${totals.passed}`);
  console.log(`Failed: ${totals.failed}`);
  console.log(`Total: ${totals.total}`);
}

export default { logGroupName, logSpecResult, logTotals };

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