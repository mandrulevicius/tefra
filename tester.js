import asserter from './asserter.js';
// should have describe, it and asserter
// should be able to BDD
// should be able to nest describes
function describe(description, callback) {
  console.log(description);
  callback();
}

function it(description, callback) {
  try {
    callback();
    console.log(`  ${description}: pass`);
  } catch (error) {
    // handle actual errors, exceptions
    if (error instanceof Error) return console.log(`  ${description} -`, error);
    console.log(`  ${description}: fail`);
    console.log('    expected:', error.expected);
    console.log('    actual:', error.actual);
  }
}

export default { describe, it };