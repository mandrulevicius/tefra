setLogToConsole(false);
const incorrectSyntaxResults = {};
try {
  test('test without describe', () => {
    equal('t1', 't1');
  });
} catch (error) {
  incorrectSyntaxResults.itWithoutDescribe = error;
}
try {
  describe('outer describe', () => {
    test('test with nested describe', () => {
      describe('nested describe inside test', () => {
      });
    });
  });
} catch (error) {
  incorrectSyntaxResults.itWithNestedDescribe = error;
}
try {
  describe('outer describe', () => {
    test('test with nested test', () => {
      test('inner test', () => {
        equal('t1', 't1');
      });
    });
  });
} catch (error) {
  incorrectSyntaxResults.itWithNestedIt = error;
}

try {
  describe(23, () => {});
} catch (error) {
  incorrectSyntaxResults.describeWithNumberName = error;
}
try {
  describe('no func', 'bad describe arg');
} catch (error) {
  incorrectSyntaxResults.describeWithBadFunc = error;
}
try {
  describe();
} catch (error) {
  incorrectSyntaxResults.describeWithoutArgs = error;
}
try {
  describe('no function in describe');
} catch (error) {
  incorrectSyntaxResults.describeWithoutFunc = error;
}

try {
  describe('duplicate group name', () => {});
  describe('duplicate group name', () => {});
} catch (error) {
  incorrectSyntaxResults.duplicateGroupName = error;
}

describe('test bad its', () => {
  try {
    test(23, () => {});
  } catch (error) {
    incorrectSyntaxResults.itWithNumberName = error;
  }
  try {
    test('ba', 'bad test arg');
  } catch (error) {
    incorrectSyntaxResults.itWithBadFunc = error;
  }
  try {
    test();
  } catch (error) {
    incorrectSyntaxResults.itWithoutArgs = error;
  }
  try {
    test('no function in test');
  } catch (error) {
    incorrectSyntaxResults.itWithoutFunc = error;
  }
  try {
    test('duplicate name', () => {});
    test('duplicate name', () => {});
  } catch (error) {
    incorrectSyntaxResults.duplicateItName = error;
  }
});

try {
  describe('more than one beforeEach', () => {
    beforeEach(() => {
    });
    beforeEach(() => {
    });
  });
} catch (error) {
  incorrectSyntaxResults.moreThanOneBeforeEach = error;
};
try {
  beforeEach(() => {
  });
} catch (error) {
  incorrectSyntaxResults.topLevelBeforeEach = error;
};
try {
  describe('bad describe - beforeEach in test', () => {
    test('test with nested beforeEach', () => {
      beforeEach(() => {
      });
    });
  });
} catch (error) {
  incorrectSyntaxResults.itWithNestedBeforeEach = error;
};
try {
  describe('bad describe - describe in beforeEach', () => {
    beforeEach(() => {
      describe('error in describe', () => {
      });
    });
    describe('beforeEach callback only runs if there is describe or test in same level', () => {
    });
  });
} catch (error) {
  incorrectSyntaxResults.describeInBeforeEach = error;
};

try {
  describe('error in describe', () => {
    throw new Error('error in describe');
  });
} catch (error) {
  incorrectSyntaxResults.errorInDescribe = error;
};
try {
  describe('error in beforeEach', () => {
    beforeEach(() => {
      throw new Error('error in beforeEach');
    });
    describe('error here', () => {
    });
  });
} catch (error) {
  incorrectSyntaxResults.errorInBeforeEach = error;
};

// TEST should throw async error - maybe wont even need if end result will support async

// describe('testAsync', () => {
//   test('should pass - return same value as argument', () => {
//     //equal(await echoer.asyncFunc('t1'), 't1');
//     echoer.asyncFunc('t1').then((result) => { equal(result, 't1') })
//   });
//   test('should fail', () => {
//     //equal(await echoer.asyncFunc('t1'), 't2');
//     echoer.asyncFunc('t1').then((result) => { equal(result, 't2') }).catch((error) => {throw error})
//     // this still results in the equal result not being caught properly
//   });
//   // test('should catch error', async () => {
//   //   throwsError(echoer.asyncFunc, new Error('bad'), 't1');
//   // });
// });

export default incorrectSyntaxResults;