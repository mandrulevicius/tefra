// THIS IS TEMPORARY FOR INTERNAL TESTING PURPOSES

import './test/tester.test.js';

//import './tempTestTargets/test/echoDef.test.js'
//import './tempTestTargets/test/echoNamed.test.js'
//import './tempTestTargets/test/echoBoth.test.js'

//regression test
//import './tempTestTargets/test/asserterTests/echoer.test.js'


// THIS IS FOR PACKAGE EXPOSURE
import asserter from './asserter.js';

export default { asserter };