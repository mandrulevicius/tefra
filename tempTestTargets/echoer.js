function echo(input) {
  return input;
}

function achoo(input) {
  throw Error('bad');
  return 'achoo ' + input / 0;
}

export default { echo, achoo };