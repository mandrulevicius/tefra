// while having tests for a test framework seems weird, its mostly for programmatically documenting behavior and edge cases

import asserter from '../../../asserter.js';
import echoer from '../../echoer.js';

//console.log('echoer', echoer)
console.log('test1');
console.log('echoer.asyncFunc();', echoer.asyncFunc('jack')); // return promise
echoer.asyncFunc('joa').then(console.log); // promise result is passed into the function provided in .then
console.log('test2 does not wait');
console.log('await', await echoer.asyncFunc('shmoa')); // waits for completion promise result is returned directly
console.log('test3');

// primitives
const primPass = asserter.isEqual(echoer.echo('t1'), 't1');
const primFail = asserter.isEqual(echoer.echo('t1'));
console.log('primPass', primPass)
console.log('primFail', primFail)

//const resultAchoo = asserter.isEqual(echoer.achoo('t1'), 'achoo t1');
// asserter does not handle errors
//console.log('resultAchoo', resultAchoo)

// objects
const objPass = asserter.isEqual(echoer.echo({ hey: 't1' }), { hey: 't1' });
const objFail = asserter.isEqual(echoer.echo({ hey: 't1' }));
console.log('objPass', objPass)
console.log('objFail', objFail)

// deep objects
const deepObjPass = asserter.isEqual(echoer.echo({ hey: { bay: "yea" } }), { hey: { bay: "yea" } });
const deepObjFail = asserter.isEqual(echoer.echo({ hey: { bay: "yea" } }), { hey: { bay: "ye" } });
console.log('deepObjPass', deepObjPass)
console.log('deepObjFail', deepObjFail)

// func
function test1 () {
  return 'ran function test1'
}

function test2 () {
  return 'ran function test1'
}

const testers = {
  anon1: () => {
    return 'ran anon function'
  },
  anon2: () => {
    return 'ran anon function'
  }
}

const funky1 = test1;

const funcPass = asserter.isEqual(echoer.echo(test1), funky1);
const funcFail = asserter.isEqual(echoer.echo(test1));
console.log('funcPass', funcPass)
console.log('funcFail', funcFail)