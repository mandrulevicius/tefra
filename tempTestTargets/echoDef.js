const def = {}; // this basically shows which functions are external

def.echo = function(input) {
  return input;
}

def.achoo = function(input) {
 return 'achoo ' + input;
}

export default def;