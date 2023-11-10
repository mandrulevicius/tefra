function echo(input) {
  return input;
}

function errFunc(input) {
  throw new Error('bad');
}

async function asyncFunc(input) {
  return new Promise(resolve => setTimeout(() => resolve(input), 1000));
}

export default { echo, errFunc, asyncFunc };