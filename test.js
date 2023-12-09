import testRunner from './testRunner.js';
const testResults = await testRunner.runTests('./test/tester.test.js');
//console.log('RESULTS', testResults);

//import './test/tester.test.js';

//import './tempTestTargets/test/echoDef.test.js'
//import './tempTestTargets/test/echoNamed.test.js'
//import './tempTestTargets/test/echoBoth.test.js'

//regression test
//import './tempTestTargets/test/asserterTests/echoer.test.js'