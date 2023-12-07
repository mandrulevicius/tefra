export class StructureError extends SyntaxError {
  constructor(message) {
    super(`Invalid structure: ${message}`);
    this.name = 'StructureError';
  }
}

export class ArgumentTypeError extends TypeError {
  constructor(expectedType, receivedType) {
    super(`Invalid argument: expected ${expectedType} but received ${receivedType}.`);
    this.name = 'ArgumentTypeError';
    this.expectedType = expectedType;
    this.receivedType = receivedType;
  }
}

export class AsyncError extends Error {
  constructor() {
    super('Asynchronous code is not supported in this version. Please use testerAsync for that.');
    this.name = 'AsyncError';
  }
}

export default { StructureError, ArgumentTypeError, AsyncError };