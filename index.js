// THIS IS TEMPORARY FOR INTERNAL TESTING PURPOSES
import './tempTestTargets/test/echoer.test.js'
//import './tempTestTargets/test/echoDef.test.js'
//import './tempTestTargets/test/echoNamed.test.js'
//import './tempTestTargets/test/echoBoth.test.js'
import './tempTestTargets/test/asserterTests/echoer.test.js' //regression test


// THIS IS FOR PACKAGE EXPOSURE
import asserter from './asserter.js';

export default { asserter };