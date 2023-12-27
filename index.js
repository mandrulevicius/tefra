#!/usr/bin/env node

import testRunner from './testRunner.js';
console.log('RUNNING TESTS...');
const pathUnderTest = process.argv[2];
const exclusions = process.argv[3];
console.log('process.argv[0]', process.argv[0]);
console.log('process.argv[1]', process.argv[1]);
console.log('pathUnderTest', pathUnderTest);
console.log('exclusions', exclusions);
const testResults = await testRunner.runTests(pathUnderTest, exclusions);

export default testRunner;