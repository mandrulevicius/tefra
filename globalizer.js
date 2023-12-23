const globalNamespace = determineGlobal();

function determineGlobal() {
  return typeof window !== 'undefined' ? window : global;
}

/**
 * Attaches the given argument to the global namespace under the given name.
 * Throws if no name is provided or if that name already exists on the global.
 * 
 * Mainly for functions. If need to hold global state, make sure to use setters.
 *
 * @param {*} arg - The value to attach to the global
 * @param {string} [name] - The name to attach the value to on the global
 */
export function attachGlobal(arg, name = arg.name) {
  if (!name) throw new Error(`No name provided`);
  if (globalNamespace[name] !== undefined) throw new Error(`Global already contains '${name}'`);
  globalNamespace[name] = arg;
}
