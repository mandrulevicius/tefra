function echo(input) {
  return input;
}

function badStringInput(input, arg2) {
  if (typeof input !== 'string') return {
    success: false,
    error: {
      message: 'Invalid argument type',
      expected: 'string',
      received: typeof input,
      input: input
    }
  };
  if (typeof arg2 !== 'string') return {
    success: false,
    error: {
      message: 'Invalid argument type',
      expected: 'string',
      received: typeof arg2,
      arg2: arg2
    }
  };
  // this is a bit clunky, only use at boundaries
  // also kind of expects object as an output with success: true
  // so certainly should only be used in boundaries
  return { success: true, output: input + arg2 };
}

function errFunc(input) {
  throw new Error('bad');
}

async function asyncFunc(input) {
  return new Promise(resolve => setTimeout(() => resolve(input), 1000));
}

export default { echo, badStringInput, errFunc, asyncFunc };