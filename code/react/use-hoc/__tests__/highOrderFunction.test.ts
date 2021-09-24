/* eslint-disable @typescript-eslint/no-explicit-any */
import { useRef } from "react";
import { useCurrentRef } from "./current";

type AnyFunction = (...args: any[]) => any;
type InputFunction = AnyFunction;
type OutputFunction<T extends InputFunction> = (
  ...outputFnArgs: Parameters<T>
) => ReturnType<T>;

type HighOrderFunction<T extends AnyFunction, R extends AnyFunction> = (
  inputFn: T,
  ...otherArgs: any[]
) => R;

const useAnyHighOrderFunction = <T extends AnyFunction, R extends AnyFunction>(
  highOrder: HighOrderFunction<T, R>,
  inputFunction: T,
  ...otherArgs: any[]
) => {
  // We don't support updating `highOrder` or `otherArgs` during the lifecycle of this hook.
  // One possible solution would be an HookFactory for example:
  // const highOrderFunctionHookFactory = (highOrder, ...otherArgs) => (inputFunction) => outputFunction;
  // But it may be hard to understand at the current Hook pattern. So we'll keep
  // it as a standard hook, and ignore any change at `highOrder` or 'otherArgs' input. After all,
  // changing `highOrder` or 'otherArg' should be just an edge case.

  // HighOrderFunction output normally has state at its closure. To keep the closure in context,
  // we'll only run the high order function once. To make it work, we have to:
  // 1. inputFunction may change with different closure during the lifecycle of this hook.
  // we have to wrap it, and ensure the outputFunction always call the latest version
  // of the inputFunction.
  // 2. the result of the HighOrderFunction must be kept in a Ref. So we can always
  // return it, although HighOrderFunction only execute once.
  const inputRef = useCurrentRef(inputFunction);
  const outputRef = useRef<R>();
  if (outputRef.current == null) {
    // if we use `const outputRef = useRef<R>(highOrder(...))`. Although the result
    // of the `highOrder(...)` will be used as the initial value of `useRef`, and
    // won't update the Ref again, we'll still call the `highOrder` function at every
    // re-render. To avoid it, move calling `highOrder` inside a null checking.
    const inputWrapper = ((...args: Parameters<T>): ReturnType<T> =>
      inputRef.current(...args)) as T;
    outputRef.current = highOrder(inputWrapper, ...otherArgs);
  }

  return outputRef.current;
};

/**
 * This type only applies to the high order function that output function has the same
 * signature with the input function.
 * If the high order function doesn't match this pattern, then use useAnyHighOrderFunction
 * Their only difference is the type system.
 */
const useHighOrderFunction = <
  T extends InputFunction,
  R extends OutputFunction<T>
>(
  highOrder: HighOrderFunction<T, R>,
  inputFunction: T,
  ...otherArgs: any[]
) => useAnyHighOrderFunction(highOrder, inputFunction, ...otherArgs);

export {
  useAnyHighOrderFunction,
  useHighOrderFunction,
  AnyFunction,
  InputFunction,
  OutputFunction,
  HighOrderFunction,
};
