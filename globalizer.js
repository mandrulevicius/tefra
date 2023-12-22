const globalNamespace = determineGlobal();

function determineGlobal() {
  return typeof window !== 'undefined' ? window : global;
}

export function attachGlobal(arg, name = arg.name) {
  if (!name) throw new Error(`No name provided`);
  if (globalNamespace[name] !== undefined) throw new Error(`Global already contains '${name}'`);
  globalNamespace[name] = arg;
}
// Mainly for functions. If need to hold global state, make sure to use setters.
