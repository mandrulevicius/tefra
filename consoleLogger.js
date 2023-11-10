function logGroupName(groupName, indent = '') {
  console.log(`${indent}${groupName}`);
}

function logSpecResult(spec, specName, indent = '') {
  if (spec.status === 'pass') {
    console.log(`${indent}${specName}: pass`);
  } else if (spec.status === 'fail') {
    console.log(`${indent}${specName}: fail`);
    console.log(`${indent}  `, JSON.stringify(spec.error));
  } else {
    console.log(`${indent}${specName} -`, spec.error);
  }
}

export default { logGroupName, logSpecResult };

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