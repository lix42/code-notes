import React from "react";
import _isEqual from "lodash/isEqual";

import useDerivedState from "./useDerivedState";

type SetLocalState<T> = React.Dispatch<React.SetStateAction<T>>;
type GetLocalState<T> = () => T;
type BeforeStateUpdate<T> = (prevProp: T, prevState: T) => void;

/**
 * A simple custom hooks to keep a local state which is also updated from prop.
 * If the localState is not set with prop direct, useDerivedState
 * @param prop: the prop used to init/reset the local state
 * @param beforeStateUpdate: callback before the prop updated the local state
 * @param isEqual: comparing function to detect if the prop is changed.
 */
const useLocalState = <T>(
  prop: T,
  beforeStateUpdate?: BeforeStateUpdate<T>,
  isEqual: (prev: T, next: T) => boolean = _isEqual
): [T, SetLocalState<T>, GetLocalState<T>] =>
  useDerivedState(prop, (_) => _, beforeStateUpdate, isEqual);

export default useLocalState;
