import { equal } from '../asserter.js';
import { StructureError, ArgumentTypeError, AsyncError } from '../errors.js';
//import echoerResults from './dummies/echoerTest.js';
//import incorrectSyntaxResults from './dummies/badSyntax.js';

// NEW TESTER HERE
// for (const testFile of jsFiles) {
//   // really want to add them to queue rather than run right now
//   tester.initFileTest(testFile);
//   await import('./' + testFile);
// }
// const results = tester.getResults();

setLogToConsole(true);
// this would all be a lot easier if i could make instances of tester.js
//console.log('echoerResults', echoerResults);
//console.log('incorrectSyntaxResults', incorrectSyntaxResults);
//console.log('globals', global.tester) // why this empty?
describe('tester correct specs', () => {
  it('should have status error', () => {
    equal(echoerResults.status, "error");
  });
  it('should pass 19 specs', () => {
    equal(echoerResults.passed, 19);
  });
  it('should fail 7 specs', () => {
    equal(echoerResults.failed, 7);
  });
  it('should catch 1 error in specs', () => {
    equal(echoerResults.error, 1);
  });
  it('should result in a total of 27 specs', () => {
    equal(echoerResults.total, 27);
  });
  const testBlockOuter3details = echoerResults.details.testBlockOuter3.details;
  it('should pass test', () => {
    const specName = 'should pass - return same value as argument';
    equal(testBlockOuter3details.testBlock.details[specName].status, 'passed');
  });
  it('should fail test', () => {
    const specName = 'should fail';
    equal(testBlockOuter3details.testBlock.details[specName].status, 'failed');
  });
  it('should pass test - catch error', () => {
    const specName = 'should catch error';
    equal(testBlockOuter3details.testBlock.details[specName].status, 'passed');
  });
  it('should error test', () => {
    const specName = 'should throw error';
    equal(testBlockOuter3details.testBlock2.details[specName].status, 'error');
  });
});
describe('tester incorrect specs', () => {
  it("should throw error if 'it' is not nested in 'describe'", () => {
    equal(incorrectSyntaxResults.itWithoutDescribe instanceof StructureError, true);
  });
  it("should throw error if 'describe' is nested in 'it'", () => {
    equal(incorrectSyntaxResults.itWithNestedDescribe instanceof StructureError, true);
  });
  it("should throw error if 'it' is nested in 'it'", () => {
    equal(incorrectSyntaxResults.itWithNestedIt instanceof StructureError, true);
  });
  it("should throw error if 'describe' is given a number as a name", () => {
    equal(incorrectSyntaxResults.describeWithNumberName instanceof ArgumentTypeError, true);
  });
  it("should throw error if 'describe' is given a non-function as a callback", () => {
    equal(incorrectSyntaxResults.describeWithBadFunc instanceof ArgumentTypeError, true);
  });
  it("should throw error if 'describe' is given no arguments", () => {
    equal(incorrectSyntaxResults.describeWithoutArgs instanceof ArgumentTypeError, true);
  });
  it("should throw error if 'describe' is given no callback", () => {
    equal(incorrectSyntaxResults.describeWithoutFunc instanceof ArgumentTypeError, true);
  });
  it("should throw error if 'it' is given a number as a name", () => {
    equal(incorrectSyntaxResults.itWithNumberName instanceof ArgumentTypeError, true);
  });
  it("should throw error if 'it' is given a non-function as a callback", () => {
    equal(incorrectSyntaxResults.itWithBadFunc instanceof ArgumentTypeError, true);
  });
  it("should throw error if 'it' is given no arguments", () => {
    equal(incorrectSyntaxResults.itWithoutArgs instanceof ArgumentTypeError, true);
  });
  it("should throw error if 'it' is given no callback", () => {
    equal(incorrectSyntaxResults.itWithoutFunc instanceof ArgumentTypeError, true);
  });
  it("should throw error if 'it' is given a duplicate name", () => {
    equal(incorrectSyntaxResults.duplicateItName instanceof StructureError, true);
  });
  it("should throw error if 'describe' is given a duplicate name", () => {
    equal(incorrectSyntaxResults.duplicateGroupName instanceof StructureError, true);
  });
  it("should throw error if 'beforeEach' is given more than one", () => {
    equal(incorrectSyntaxResults.moreThanOneBeforeEach instanceof StructureError, true);
  });
  it("should throw error if 'beforeEach' is given at the top level", () => {
    equal(incorrectSyntaxResults.topLevelBeforeEach instanceof StructureError, true);
  });
  it("should throw error if 'it' is given a nested beforeEach", () => {
    equal(incorrectSyntaxResults.itWithNestedBeforeEach instanceof StructureError, true);
  });
  it("should throw error if 'beforeEach' is given a nested describe", () => {
    equal(incorrectSyntaxResults.describeInBeforeEach instanceof StructureError, true);
  });
  it("should throw error if 'describe' has an error in it", () => {
    equal(incorrectSyntaxResults.errorInDescribe instanceof Error, true);
  });
  it("should throw error if 'beforeEach' has an error in it", () => {
    equal(incorrectSyntaxResults.errorInBeforeEach instanceof Error, true);
  });
});

