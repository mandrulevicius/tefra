import testRunner from './testRunner.js';
const pathUnderTest = process.argv[2];
const testResults = await testRunner.runTests(pathUnderTest, ['testerAsync.test.js']);
  
//console.log('RESULTS', testResults);

//import './test/tester.test.js';

//import './tempTestTargets/test/echoDef.test.js'
//import './tempTestTargets/test/echoNamed.test.js'
//import './tempTestTargets/test/echoBoth.test.js'
