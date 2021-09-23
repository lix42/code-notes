import React from "react";
import { shallow } from "enzyme";

import useDerivedState from "../useDerivedState";

const callback = jest.fn();

const Receiver: React.FC<any> = () => null;

const TestHooksWithPrimitiveValue: React.FC<{ value: string }> = ({
  value,
}) => {
  const [localValue, setLocalValue] = useDerivedState(
    value,
    (_) => `local ${_}`,
    callback
  );
  return (
    <Receiver
      value={value}
      localValue={localValue}
      setLocalValue={setLocalValue}
    />
  );
};

const TestHooksWithObjectValue: React.FC<{ foo: string; bar: string }> = ({
  foo,
  bar,
}) => {
  const [localValue, setLocalValue] = useDerivedState(
    { foo, bar },
    (_) => `local ${_.foo} ${_.bar}`,
    callback
  );
  return (
    <Receiver
      value={`${foo} ${bar}`}
      localValue={localValue}
      setLocalValue={setLocalValue}
    />
  );
};

describe("useDerivedState", () => {
  beforeEach(() => {
    callback.mockClear();
  });
  describe("with primitive type state", () => {
    it("should init the local state form prop", () => {
      const wrapper = shallow(<TestHooksWithPrimitiveValue value="value" />);
      expect(wrapper.props()).toMatchObject({
        value: "value",
        localValue: "local value",
      });
    });

    it("should update the local state when the prop is changed", () => {
      const wrapper = shallow(<TestHooksWithPrimitiveValue value="value" />);
      expect(wrapper.props()).toMatchObject({
        value: "value",
        localValue: "local value",
      });
      wrapper.setProps({ value: "newValue" });
      expect(wrapper.props()).toMatchObject({
        value: "newValue",
        localValue: "local newValue",
      });
      expect(callback).toHaveBeenCalledWith("value", "local value");
    });

    it("should update the local state with the setLocalState function", () => {
      const wrapper = shallow(<TestHooksWithPrimitiveValue value="value" />);
      expect(wrapper.props()).toMatchObject({
        value: "value",
        localValue: "local value",
      });
      wrapper.prop("setLocalValue")("modified value");
      expect(wrapper.props()).toMatchObject({
        value: "value",
        localValue: "modified value",
      });
      expect(callback).not.toHaveBeenCalled();
    });

    it("should discard the local state when the prop is updated", () => {
      const wrapper = shallow(<TestHooksWithPrimitiveValue value="value" />);
      wrapper.prop("setLocalValue")("modified value");
      expect(wrapper.props()).toMatchObject({
        value: "value",
        localValue: "modified value",
      });
      expect(callback).not.toHaveBeenCalled();
      wrapper.setProps({ value: "newValue" });
      expect(wrapper.props()).toMatchObject({
        value: "newValue",
        localValue: "local newValue",
      });
      expect(callback).toHaveBeenCalledWith("value", "modified value");
    });

    it("should not discard the local state when the prop is updated with the same value", () => {
      const wrapper = shallow(<TestHooksWithPrimitiveValue value="value" />);
      wrapper.prop("setLocalValue")("modified value");
      expect(wrapper.props()).toMatchObject({
        value: "value",
        localValue: "modified value",
      });
      expect(callback).not.toHaveBeenCalled();
      wrapper.setProps({ value: "value" });
      expect(wrapper.props()).toMatchObject({
        value: "value",
        localValue: "modified value",
      });
      expect(callback).not.toHaveBeenCalled();
    });
  });

  describe("with object type state", () => {
    it("should init the local state form prop", () => {
      const wrapper = shallow(<TestHooksWithObjectValue foo="foo" bar="bar" />);
      expect(wrapper.props()).toMatchObject({
        value: "foo bar",
        localValue: "local foo bar",
      });
    });

    it("should update the local state when the prop is changed", () => {
      const wrapper = shallow(<TestHooksWithObjectValue foo="foo" bar="bar" />);
      expect(wrapper.props()).toMatchObject({
        value: "foo bar",
        localValue: "local foo bar",
      });
      wrapper.setProps({ foo: "foo2" });
      expect(wrapper.props()).toMatchObject({
        value: "foo2 bar",
        localValue: "local foo2 bar",
      });
      expect(callback).toHaveBeenCalledWith(
        { foo: "foo", bar: "bar" },
        "local foo bar"
      );
    });

    it("should update the local state with the setLocalState function", () => {
      const wrapper = shallow(<TestHooksWithObjectValue foo="foo" bar="bar" />);
      expect(wrapper.props()).toMatchObject({
        value: "foo bar",
        localValue: "local foo bar",
      });
      wrapper.prop("setLocalValue")("modified value");
      expect(wrapper.props()).toMatchObject({
        value: "foo bar",
        localValue: "modified value",
      });
      expect(callback).not.toHaveBeenCalled();
    });

    it("should discard the local state when the prop is updated", () => {
      const wrapper = shallow(<TestHooksWithObjectValue foo="foo" bar="bar" />);
      wrapper.prop("setLocalValue")("modified value");
      expect(wrapper.props()).toMatchObject({
        value: "foo bar",
        localValue: "modified value",
      });
      expect(callback).not.toHaveBeenCalled();
      wrapper.setProps({ foo: "foo2" });
      expect(wrapper.props()).toMatchObject({
        value: "foo2 bar",
        localValue: "local foo2 bar",
      });
      expect(callback).toHaveBeenCalledWith(
        { foo: "foo", bar: "bar" },
        "modified value"
      );
    });

    it("should not discard the local state when the prop is updated to the same value", () => {
      const wrapper = shallow(<TestHooksWithObjectValue foo="foo" bar="bar" />);
      wrapper.prop("setLocalValue")("modified value");
      expect(wrapper.props()).toMatchObject({
        value: "foo bar",
        localValue: "modified value",
      });
      expect(callback).not.toHaveBeenCalled();
      wrapper.setProps({ foo: "foo", bar: "bar" });
      expect(wrapper.props()).toMatchObject({
        value: "foo bar",
        localValue: "modified value",
      });
      expect(callback).not.toHaveBeenCalled();
    });
  });
});
