#!/usr/bin/env node
import { fileURLToPath } from 'url';
import testRunner from './testRunner.js';

const pathUnderTest = process.argv[2];
const exclusions = process.argv[3];
// console.log('RUNNING TESTS...');
// console.log('process.argv[0]', process.argv[0]);
// console.log('process.argv[1]', process.argv[1]);
// console.log('pathUnderTest', pathUnderTest);
// console.log('exclusions', exclusions);
const testResults = await testRunner.runTests(pathUnderTest, exclusions);

// WiP - NOT SUPPORTED YET
// function isImport(entryFilePath) {
//   console.log('entryFilePath', entryFilePath)
//   console.log('fileURLToPath(import.meta.url)', fileURLToPath(import.meta.url))
//   return entryFilePath !== fileURLToPath(import.meta.url);
// }

//export default testRunner;