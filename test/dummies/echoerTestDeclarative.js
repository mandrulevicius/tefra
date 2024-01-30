import echoer from './echoer.js';

// A nice try, but actually adds more complexity than removes boilerplate
tests = [
  {
    func: echoer.echo,
    tests: [
      { desc: 'Given arg should return it', args: ['t1'], expectedResult: 't1' }
    ]
  },
  {
    func: echoer.badStringInput,
    tests: [
      { args: ['t1', 'a'], expectedResult: { success: true, output: 't1a' } },
      {
        desc: 'Given wrong argument type should return validation issue',
        args: [123], expectedResult: {
          success: false,
          error: {
            message: 'Invalid argument type',
            expected: 'string',
            received: typeof 3,
            input: 3
          }
        }
      },
    ]
  },
  { func: echoer.errFunc, tests: [{ args: ['t1'], expectedError: new Error('bad') }] }
];

export { tests };