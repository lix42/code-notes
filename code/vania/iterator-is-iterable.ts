function iterateOver(...args) {
  let index = 0;
  let iterable = {
    [Symbol.iterator]() {
      index = 0;
      return {
        next() {
          if (index < args.length) {
            return { value: args[index++] };
          } else {
            return { done: true };
          }
        },
        [Symbol.iterator]() {
          return this;
        },
      };
    },
  };
  return iterable;
}

let iterable = iterateOver("a", "b");
let iterator = iterable[Symbol.iterator]();

for (let x of iterator) {
  console.log(x); // a
  break;
}

// Continue with same iterator:
for (let x of iterator) {
  console.log(x); // b
}

for (let x of iterable) {
  console.log(x); // a
  break;
}

// Continue with same iterable:
for (let x of iterable) {
  console.log(x); // a, b
}
