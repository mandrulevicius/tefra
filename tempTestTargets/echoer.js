function echo(input) {
  return input;
}

function errFunc(input) {
  throw new Error('bad'); // is there a difference between throwing new error or just an error?
  return 'achoo ' + input / 0;
}

async function asyncFunc(input) {
  return new Promise(resolve => setTimeout(() => resolve(input), 1000));
}

export default { echo, errFunc, asyncFunc };