import testRunner from './testRunner.js';
const testResults = await testRunner.runTests('./test/tester.test.js');
// will want to run tests by passing names without ./
//const testResults = await testRunner.runTests('tester.test.js');
//const testResults = await testRunner.runTests('./test', ['testerAsync.test.js']);
//const testResults = await testRunner.runTests('test', ['testerAsync.test.js']);
//console.log('RESULTS', testResults);

//import './test/tester.test.js';

//import './tempTestTargets/test/echoDef.test.js'
//import './tempTestTargets/test/echoNamed.test.js'
//import './tempTestTargets/test/echoBoth.test.js'

//regression test
//import './tempTestTargets/test/asserterTests/echoer.test.js'