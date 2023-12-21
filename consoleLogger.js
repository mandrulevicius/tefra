let logToConsole = true;

function setLogToConsole(value) {
  logToConsole = value;
}

function logFileResults(results) {
  if (!logToConsole) return;
  logGroupResults(results, 0);
  logTotals(results);
}

function logGroupResults(results, depth) {
  if (!logToConsole) return;
  if (!results.details) return logSpecResult(results, depth);
  logGroupName(results.name, depth);
  for (const groupName in results.details) {
    logGroupResults(results.details[groupName], depth + 1);
  }
}

function logGroupName(groupName, depth = 0) {
  if (!logToConsole) return;
  const indent = '  '.repeat(depth);
  console.log(`${indent}${groupName}`);
}

function logSpecResult(spec, depth = 0) {
  if (!logToConsole) return;
  const indent = '  '.repeat(depth);
  if (spec.status === 'passed') {
    console.log(`${indent}[+] ${spec.name} [${spec.duration.toFixed(3)} ms]`);
  } else if (spec.status === 'failed') {
    console.log(`${indent}[-] ${spec.name}`);
    console.log(`${indent}  `, `Actual: ${JSON.stringify(spec.output.actual)}`);
    console.log(`${indent}  `, `Expect: ${JSON.stringify(spec.output.expected)}`);
  } else {
    console.log(`${indent}[x] ${spec.name} -`, spec.error);
  }
}

function logTotals(results) {
  if (!logToConsole) return;
  if (!results.parent) console.log('~~~ Total Results ~~~');
  console.log(`Status: ${results.status}`);
  console.log(`  Passed: ${results.passed}`);
  console.log(`  Failed: ${results.failed}`);
  console.log(`  Error: ${results.error}`);
  console.log(`  Total: ${results.total}`);
  console.log(`  Duration: ${results.duration.toFixed(3)} ms`);
  console.log('\n');
}

function attachGlobal(func) {
  if (global[func.name]) throw new Error(`Global already contains ${func.name}`);
  global[func.name] = func;
}

attachGlobal(setLogToConsole);

export default { logFileResults, logTotals };
