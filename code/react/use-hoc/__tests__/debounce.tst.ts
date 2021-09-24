import debounce from "lodash/debounce";
import { useDebounceDoNotUse } from "@amzn/sagemaker-ui-utils";
import { act, renderHook } from "@testing-library/react-hooks";
import { useDebounce } from "../debounce";

describe("useDebounce", () => {
  it("should skip the extra function calls with lodash.debounce", (done) => {
    // jest useFakeTimer doesn't work with lodash.debounce. Have to use
    // real timer to test it. so set up a control test to verify the test case works
    const fn = jest.fn();
    const debounced = debounce(fn, 10);
    debounced("one");
    debounced("two");
    expect(fn).not.toHaveBeenCalled();
    setTimeout(() => {
      expect(fn).toHaveBeenCalledTimes(1);
      expect(fn).toHaveBeenCalledWith("two");
      done();
    }, 20);
  });

  // I'll remove this test case later. Just use it to demo the issue
  it.skip("should work with useDebounce hook (negative case)", (done) => {
    const fn = jest.fn();
    const hook = renderHook(() => useDebounceDoNotUse(fn, 10));
    hook.result.current("one");
    act(() => {
      hook.rerender();
    });
    hook.result.current("two");
    expect(fn).not.toHaveBeenCalled();
    setTimeout(() => {
      expect(fn).toHaveBeenCalledTimes(1);
      expect(fn).toHaveBeenCalledWith("two");
      done();
    }, 20);
  });

  it("should work with useDebounce hook", (done) => {
    const fn = jest.fn();
    const hook = renderHook(() => useDebounce(fn, 10));
    hook.result.current("one");
    act(() => {
      hook.rerender();
    });
    hook.result.current("two");
    expect(fn).not.toHaveBeenCalled();
    setTimeout(() => {
      expect(fn).toHaveBeenCalledTimes(1);
      expect(fn).toHaveBeenCalledWith("two");
      done();
    }, 20);
  });
});
