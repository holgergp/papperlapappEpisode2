const logEffect = require("./logger").logEffect;
const axios = require('axios');
const APICall1 = async () => {
  return  axios.get("https://binaryjazz.us/wp-json/genrenator/v1/genre/")
    .then((r) => {
      console.log("Finished with ", r);
      return r;
    });
};
const APICall2 = async () => {
  return  axios.get("https://binaryjazz.us/wp-json/genrenator/v1/count/")
    .then((r) => {
      console.log("Finished with ", r);
      return r;
    });
};

function miniReduxSaga(generatorFactory) {
  const generator = generatorFactory();

  return (function resolve(result) {
    if (result.done) {
      return result.value;
    }

    return Promise.resolve(result.value)
      .then((ensuredValue) => resolve(generator.next(ensuredValue)))
      .catch((error) => resolve(generator.throw(error)));
  })(generator.next());
}

function runLoop(generator) {
  const result = generator.next();
  console.log("First tick", result);
  result.value
    .then((ensuredValue) => {
      const secondTick = generator.next(ensuredValue);
      console.log("Second tick", secondTick);
    })
    .catch((error) => generator.throw(error));
}

(async () => {
  await runSaga(function* () {
    const foo = yield call(APICall1);
    const foo2 = yield call(APICall2);
  });
})();

function call(method, args) {
  return { type: "call", method, args };
}

async function runSaga(saga) {
  const it = saga();
  let result = it.next();
  while (!result.done) {
    const effect = result.value;
    logEffect(effect);
    switch (effect.type) {
      case "call":
        result = it.next(await effect.method(...(effect.args ?? [])));
        break;
      default:
        break;
    }
  }
}
