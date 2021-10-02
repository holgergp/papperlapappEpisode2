describe("Generator functions", () => {
  it("our first generator", () => {
    function* genFnFactory() {}
    const genFn = genFnFactory();
    const whatsInIt = genFn.next();
    expect(whatsInIt).toEqual({ done: true, value: undefined });
  });

  it("our first generator with empty yield", () => {
    function* genFnFactory() {
      yield;
    }
    const genFn = genFnFactory();
    const whatsInIt = genFn.next();
    expect(whatsInIt).toEqual({ done: false, value: undefined });
    const whatsInItNow = genFn.next();
    expect(whatsInItNow).toEqual({ done: true, value: undefined });
  });

  it("our first generator with yield", () => {
    function* genFnFactory() {
      yield "1";
    }
    const genFn = genFnFactory();
    const whatsInIt = genFn.next();
    expect(whatsInIt).toEqual({ done: false, value: "1" });
    const whatsInItNow = genFn.next();
    expect(whatsInItNow).toEqual({ done: true, value: undefined });
  });

  it("our first generator with assigning yields", () => {
    function* genFnFactory() {
      const first = yield "1";
      yield first;
    }
    const genFn = genFnFactory();
    const whatsInIt = genFn.next();
    expect(whatsInIt).toEqual({ done: false, value: "1" });
    const whatsInItNow = genFn.next(3);
    expect(whatsInItNow).toEqual({ done: false, value: 3 });
  });

  it("our generator calling another generator (enter yield*)", () => {
    function* genFnFactoryFirst() {
      yield;
      yield "2";
    }
    function* genFnFactorySecond() {
      yield* genFnFactoryFirst();
    }
    const genFn = genFnFactorySecond();
    const whatsInIt = genFn.next();
    expect(whatsInIt).toEqual({ done: false, value: undefined });
    const whatsInItNow = genFn.next();
    expect(whatsInItNow).toEqual({ done: false, value: "2" });
  });

  it("our generator listens (observer)", () => {
    let consoleSimulator = [];

    function* genFactoryObserver() {
      while (true) {
        const data = yield;
        console.log(data);
        consoleSimulator.push(data);
      }
    }
    const genFn = genFactoryObserver();
    genFn.next("Starting");
    genFn.next("New Data");
    genFn.next("Newish Data");
    expect(consoleSimulator).toEqual(["New Data", "Newish Data"]);
  });

  it("our generator on a string (multitasking)", () => {
    function* numberGeneratorFactory() {
      let i = 0;
      while (true) {
        yield i++;
      }
    }
    function* stringGeneratorFactory() {
      let i = "";
      while (true) {
        yield i + "b";
      }
    }
    const numberGenerator = numberGeneratorFactory();
    const stringGenerator = stringGeneratorFactory();

    let nextNumber = numberGenerator.next();
    expect(nextNumber).toEqual({ done: false, value: 0 });
    nextNumber = numberGenerator.next();
    expect(nextNumber).toEqual({ done: false, value: 1 });
    let nextString = stringGenerator.next();
    expect(nextString).toEqual({ done: false, value: "b" });
  });

  it("enter throw", () => {
    function* genFnFactory() {
      const first = yield "1";
      yield first;
    }
    const genFn = genFnFactory();
    const whatsInIt = genFn.next();
    expect(whatsInIt).toEqual({ done: false, value: "1" });
    let whatsThrown;
    let error;
    try {
      whatsThrown = genFn.throw(Error("Generator throws an error"));
    } catch (e) {
      error = e;
    }
    expect(error.message).toBe("Generator throws an error");
    expect(whatsThrown).not.toBeDefined();
  });

  it("enter return", () => {
    function* genFnFactory() {
      const first = yield "1";
      yield first;
    }
    const genFn = genFnFactory();
    const whatsInIt = genFn.next();
    expect(whatsInIt).toEqual({ done: false, value: "1" });
    const whatsInItNow = genFn.return(5);
    expect(whatsInItNow).toEqual({ done: true, value: 5 });
  });

  it("enter return (Spezial für Stefan!))", () => {
    function* genFnFactory() {
      try {
        yield "1";
      } finally {
        yield "2";
      }
      yield "3";
    }
    const genFn = genFnFactory();
    const whatsInIt = genFn.next();
    expect(whatsInIt).toEqual({ done: false, value: "1" });
    const whatsInItNow = genFn.return(5);
    expect(whatsInItNow).toEqual({ done: false, value: "2" });
    const whatsInItLast = genFn.next();
    expect(whatsInItLast).toEqual({ done: true, value: 5 });
  });

  function miniCo(generatorFactory) {
    const generator = generatorFactory();
    const result = generator.next();
    console.log("First tick", result);

    result.value
      .then((ensuredValue) => {
        const secondTick = generator.next(ensuredValue);
        console.log("Second tick", secondTick);
      })
      .catch((error) => generator.throw(error));
  }

  it("Generators and Promises (a little advanced)", () => {
    let consoleSimulator = [];

    miniCo(function* () {
      const a = yield Promise.resolve(1);
      consoleSimulator.push(a);
      expect(consoleSimulator).toEqual([1]);
    });
  });

  describe.skip("iterators", () => {
    function* genFnFactory() {
      yield "1";
      yield "2";
      yield "3";
    }

    it("generator functions and custom iterators", () => {
      let genFnIterator = genFnFactory();
      for (const item of genFnIterator) {
        console.log("GenFn Item " + item);
      }

      let i = 0;
      const customIteratorFactory = {
        [Symbol.iterator]: () => {
          return {
            next: () => {
              i++;
              if (i < 4) {
                return {
                  value: i + "",
                  done: false,
                };
              }
              i = 0;
              return {
                done: true,
              };
            },
          };
        },
      };
      for (const item of customIteratorFactory) {
        console.log("Custome Iterator Item " + item);
      }

      const customIterator = customIteratorFactory[Symbol.iterator]();
      genFnIterator = genFnFactory();

      expect(genFnIterator.next()).toEqual(customIterator.next());
      expect(genFnIterator.next()).toEqual(customIterator.next());
      expect(genFnIterator.next()).toEqual(customIterator.next());
      expect(genFnIterator.next()).toEqual(customIterator.next());
    });
    it("generator functions and arrays", () => {
      const myArray = ["1", "2", "3"];
      for (const item of myArray) {
        console.log("Array Item " + item);
      }

      const arrayIterator = myArray[Symbol.iterator]();
      const genFnIterator = genFnFactory();

      expect(genFnIterator.next()).toEqual(arrayIterator.next());
      expect(genFnIterator.next()).toEqual(arrayIterator.next());
      expect(genFnIterator.next()).toEqual(arrayIterator.next());
      expect(genFnIterator.next()).toEqual(arrayIterator.next());
    });
  });
});
