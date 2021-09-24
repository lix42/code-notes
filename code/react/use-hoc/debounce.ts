import { DebouncedFunc, DebounceSettings } from "lodash";
import debounce from "lodash/debounce";
import { AnyFunction, useAnyHighOrderFunction } from "./highOrderFunction";

// In milliseconds
const DEFAULT_DEBOUNCE_WAIT = 500;

/**
 * depends on the use case, it may be needed to call debouncedFn.cancel or flush at useEffect.
 * sample code:
 * ```
 * useEffect(() => () => debounceFn.flush(), [debouncedFn]);
 * ```
 * debouncedFn won't change at re-render, so the sample effect will only call `flush`
 * when the component is umount.
 */
const useDebounce = <T extends AnyFunction>(
  inputFn: T,
  wait: number = DEFAULT_DEBOUNCE_WAIT,
  options?: DebounceSettings
): DebouncedFunc<T> =>
  useAnyHighOrderFunction(debounce, inputFn, wait, options);

export { useDebounce };
