#!/usr/bin/env node
import testRunner from './testRunner.js';

const pathUnderTest = process.argv[2];
const exclusions = process.argv[3];
await testRunner.runTests(pathUnderTest, exclusions);
