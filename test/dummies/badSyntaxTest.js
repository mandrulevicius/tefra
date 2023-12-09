import { equal } from '../../asserter.js';

setLogToConsole(false);
const incorrectSyntaxResults = {};
try {
  it('it without describe', () => {
    equal('t1', 't1');
  });
} catch (error) {
  incorrectSyntaxResults.itWithoutDescribe = error;
}
try {
  describe('outer describe', () => {
    it('it with nested describe', () => {
      describe('nested describe inside it', () => {
      });
    });
  });
} catch (error) {
  incorrectSyntaxResults.itWithNestedDescribe = error;
}
try {
  describe('outer describe', () => {
    it('it with nested it', () => {
      it('inner it', () => {
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
    it(23, () => {});
  } catch (error) {
    incorrectSyntaxResults.itWithNumberName = error;
  }
  try {
    it('ba', 'bad it arg');
  } catch (error) {
    incorrectSyntaxResults.itWithBadFunc = error;
  }
  try {
    it();
  } catch (error) {
    incorrectSyntaxResults.itWithoutArgs = error;
  }
  try {
    it('no function in it');
  } catch (error) {
    incorrectSyntaxResults.itWithoutFunc = error;
  }
  try {
    it('duplicate name', () => {});
    it('duplicate name', () => {});
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
  describe('bad describe - beforeEach in it', () => {
    it('it with nested beforeEach', () => {
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
    describe('beforeEach callback only runs if there is describe or it in same level', () => {
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

// TEST should throw async error

// describe('testAsync', () => {
//   it('should pass - return same value as argument', () => {
//     //equal(await echoer.asyncFunc('t1'), 't1');
//     echoer.asyncFunc('t1').then((result) => { equal(result, 't1') })
//   });
//   it('should fail', () => {
//     //equal(await echoer.asyncFunc('t1'), 't2');
//     echoer.asyncFunc('t1').then((result) => { equal(result, 't2') }).catch((error) => {throw error})
//     // this still results in the equal result not being caught properly
//   });
//   // it('should catch error', async () => {
//   //   throwsError(echoer.asyncFunc, new Error('bad'), 't1');
//   // });
// });

export default incorrectSyntaxResults;