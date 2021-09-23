import React, { useState, useRef, useCallback } from "react";
import _isEqual from "lodash/isEqual";

type SetLocalState<T> = React.Dispatch<React.SetStateAction<T>>;
type GetLocalState<T> = () => T;
type BeforeStateUpdate<P, S> = (prevProp: P, prevState: S) => void;

/**
 * a simple implementation similar to getDerivedStateFromProp, it set the derived state from the prop
 * when the prop is changed
 * @param prop: the source to get the derivedState
 * @param converter: the function to convert the prop to the derived state
 * @param beforeStateUpdate: callback before using the prop to update the state
 * @param isEqual: comparing function to detect if the prop has changed
 */
const useDerivedState = <P, S>(
  prop: P,
  converter: (_: P) => S,
  beforeStateUpdate?: BeforeStateUpdate<P, S>,
  isEqual: (prev: P, next: P) => boolean = _isEqual
): [S, SetLocalState<S>, GetLocalState<S>] => {
  const [localState, setLocalState] = useState<S>(() => converter(prop));
  const [prevProp, setPrevProp] = useState<P>(prop);
  const refLocalState = useRef(localState);
  refLocalState.current = localState;

  if (!isEqual(prevProp, prop)) {
    typeof beforeStateUpdate === "function" &&
      beforeStateUpdate(prevProp, localState);
    setPrevProp(prop);
    const newState = converter(prop);
    setLocalState(newState);
    refLocalState.current = newState;
  }

  const getLocalState: GetLocalState<S> = useCallback(
    () => refLocalState.current,
    [refLocalState]
  );

  return [localState, setLocalState, getLocalState];
};

export default useDerivedState;
