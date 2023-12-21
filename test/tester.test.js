import { StructureError, ArgumentTypeError, AsyncError } from '../errors.js';
import tester from '../tester.js';

const echoerResults = await runEchoerTest('./dummies/echoerTest.js');
const incorrectSyntaxResults = await runBadSyntaxTest('./dummies/badSyntaxTest.js');
tester.initFileTest('test\\tester.test.js');

async function runEchoerTest(testFile) {
  tester.initFileTest(testFile);
  await import(testFile);
  const results = getResults(testFile);
  tester.clearResults(testFile);
  return results;
}

async function runBadSyntaxTest(testFile) {
  tester.initFileTest(testFile);
  const results = await import(testFile);
  tester.clearResults(testFile);
  return results.default;
}

setLogToConsole(true);
describe('tester correct specs', () => {
  it('should have status error', () => {
    equal(echoerResults.status, "error");
  });
  it('should pass 20 specs', () => {
    equal(echoerResults.passed, 20);
  });
  it('should fail 8 specs', () => {
    equal(echoerResults.failed, 8);
  });
  it('should catch 1 error in specs', () => {
    equal(echoerResults.error, 1);
  });
  it('should result in a total of 29 specs', () => {
    equal(echoerResults.total, 29);
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

