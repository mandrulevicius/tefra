// THIS IS TEMPORARY FOR INTERNAL TESTING PURPOSES

import testRunner from './testRunner.js';
testRunner.runTests('./test/echoer.test.js'); // SHOULD OUTPUT ERROR IF NO FILE FOUND
testRunner.runTests('./test/dummies/echoer.test.js');
//import './test/tester.test.js';

//import './tempTestTargets/test/echoDef.test.js'
//import './tempTestTargets/test/echoNamed.test.js'
//import './tempTestTargets/test/echoBoth.test.js'

//regression test
//import './tempTestTargets/test/asserterTests/echoer.test.js'


// THIS IS FOR PACKAGE EXPOSURE
import asserter from './asserter.js';

export default { asserter, testRunner };