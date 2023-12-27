import testRunner from './testRunner.js';
const pathUnderTest = process.argv[2];
await testRunner.runTests(pathUnderTest, ['testerAsync.test.js']);
