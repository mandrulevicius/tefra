//import asserter from '../../asserter.js';
//import testFrame from '../../testFrame.js'; // test frame should have describe, it and asserter
import echoer from '../echoer.js';

// define test
// run function
// assert result (catch error automatically)

console.log('test1');
console.log('echoer.asyncFunc();', echoer.asyncFunc('jack'));
echoer.asyncFunc('joa').then(console.log);
console.log('await', await echoer.asyncFunc('shmoa'));
console.log('test2');
console.log('test3');