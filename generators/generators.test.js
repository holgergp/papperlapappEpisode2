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
  
    it("our generator on a string", () => {
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
      try {
        whatsThrown = genFn.throw(Error("Generator throws an error"));
      } catch (e) {
        expect(e.message).toBe("Generator throws an error");
      }
      expect(whatsThrown).toEqual({ done: false, value: "1" });
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

    it("iterators", () => {
      function* genFnFactory() {
        yield "1";
        yield "2";
        yield "3";
      }
      console.log("Iterables");
      const genFn = genFnFactory();
      for(const item of genFn) {
        console.log("GenFn Item " + item);
      }
      let i = 0;
      const myIterator = {
        [Symbol.iterator]:() => {
          return {next: () => {
            i++
            if(i<4) {
              return {
                value: i,
                done: false
              }
            } 
            return {
              done: true
            }
          }}
        }
    }
    for(const item of myIterator) {
      console.log("Custome Iterator Item " + item);
    } 

    const myArray = ["1","2", "3"]
    for(const item of myArray) {
      console.log("Array Item " + item);
    } 

    const arrayIterator = myArray[Symbol.iterator]()
    console.log("Array Iterator", arrayIterator.next());
    console.log("Array Iterator", arrayIterator.next());
    console.log("Array Iterator", arrayIterator.next());
    console.log("Array Iterator", arrayIterator.next());
    });
  });
  