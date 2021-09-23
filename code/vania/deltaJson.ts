type AnyJson = boolean | number | string | null | JsonArray | JsonMap;
interface JsonMap {
  [key: string]: AnyJson;
}
interface JsonArray extends Array<AnyJson> {}

type DeltaResult = {
  readonly base: AnyJson;
  readonly left: AnyJson;
  readonly right: AnyJson;
};

const getType = (input: AnyJson): string =>
  Array.isArray(input) ? "array" : input === null ? "null" : typeof input;

const isEmpty = (value: AnyJson): boolean => {
  if (value == null) {
    return true;
  }
  if (Array.isArray(value) && value.length === 0) {
    return true;
  }
  if (typeof value === "object" && Object.keys(value).length === 0) {
    return true;
  }
  return false;
};

const isDifferent = (delta: DeltaResult): boolean => {
  if (delta == null) {
    return false;
  }
  const { left, right } = delta;
  if (getType(left) !== getType(right)) {
    return true;
  }
  if (isEmpty(left) && isEmpty(right)) {
    return false;
  }
  return true;
};

export function deltaTwoJson(lhs: AnyJson, rhs: AnyJson): DeltaResult {
  const lType = getType(lhs);
  const rType = getType(rhs);
  if (lType !== rType || (lType !== "array" && lType !== "object")) {
    return lhs === rhs
      ? { base: lhs, left: null, right: null }
      : {
          base: null,
          left: lhs,
          right: rhs,
        };
  }
  if (Array.isArray(lhs) && Array.isArray(rhs)) {
    const minLength = Math.min(lhs.length, rhs.length);
    const base = [];
    let i = 0;
    for (i = 0; i < minLength; i++) {
      const delta = deltaTwoJson(lhs[i], rhs[i]);
      if (!isDifferent(delta)) {
        base.push(delta.base);
      } else {
        break;
      }
    }
    return {
      base,
      left: lhs.slice(i),
      right: rhs.slice(i),
    };
  }
  if (typeof lhs === "object" && typeof rhs === "object") {
    const base = Object.create(null);
    const left = Object.create(null);
    const right = Object.create(null);
    Object.keys(lhs).forEach((lKey) => {
      if (!(lKey in rhs)) {
        left[lKey] = lhs[lKey];
      } else {
        const delta = deltaTwoJson(lhs[lKey], rhs[lKey]);
        base[lKey] = delta.base;
        if (isDifferent(delta)) {
          left[lKey] = delta.left;
          right[lKey] = delta.right;
        }
      }
    });
    Object.keys(rhs).forEach((rKey) => {
      if (!(rKey in lhs)) {
        right[rKey] = rhs[rKey];
      }
    });
    return {
      base,
      left,
      right,
    };
  }
  return {
    base: null,
    left: lhs,
    right: rhs,
  };
}

deltaTwoJson(1, 1); /*?*/
deltaTwoJson(true, 1); /*?*/
deltaTwoJson("a", null); /*?*/
deltaTwoJson([1], []); /*?*/
deltaTwoJson([1, 2], [2]); /*?*/
deltaTwoJson([1, 2], [1]); /*?*/
deltaTwoJson([[null]], [[null]]); /*?*/
deltaTwoJson({ a: 1 }, { a: 2 }); /*?*/
deltaTwoJson({ a: 1, b: 1 }, { a: 1 }); /*?*/
deltaTwoJson({ a: 1 }, { a: 1, b: 1 }); /*?*/
deltaTwoJson({ a: [1] }, { a: [1], b: 1 }); /*?*/
deltaTwoJson({ a: [1, 2] }, { a: [1], b: 1 }); /*?*/
deltaTwoJson([{ a: 1, b: 2 }], [{ a: 1 }]); /*?*/
