const { runSaga, call, APICall1, APICall2 } = require("./simpleSaga.js");

describe.skip("run simple saga", () => {
  it("runs", async () => {
    await runSaga(function* () {
      const foo = yield call(APICall1);
      const foo2 = yield call(APICall2);
    });
  });
});
