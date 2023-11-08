import * as redux from "react-redux";
import LoginBox from "./LoginBox";
import React from "react";
import {screen, render, fireEvent} from '@testing-library/react';

describe("LoginBox component tests", () => {
   let button: HTMLButtonElement,
      input: HTMLInputElement,
      mockDispatchFn: jest.Mock,
      useDispatchSpy: jest.SpyInstance;

   const message = "test message";

   beforeEach(() => {
      useDispatchSpy = jest.spyOn(redux, "useDispatch");
      mockDispatchFn = jest.fn();
      useDispatchSpy.mockReturnValue(mockDispatchFn);

      render(<LoginBox/>);

      button = screen.getByLabelText("Name submit button");
      input = screen.getByLabelText("Name input field");
   });

   afterEach(() => {
      jest.clearAllMocks();
   });

   it("should submit only when the input field is populated", () => {
      fireEvent.click(button);

      expect(mockDispatchFn).toHaveBeenCalledTimes(0);

      fireEvent.change(input, {target: {value: message}});
      fireEvent.click(button);

      expect(mockDispatchFn).toHaveBeenCalledTimes(1);
   });

   it("should submit using the enter key or submit button", () => {

      expect(mockDispatchFn).toHaveBeenCalledTimes(0);

      fireEvent.change(input, {target: {value: message}});
      fireEvent.keyDown(input, {key: "Enter"});

      expect(mockDispatchFn).toHaveBeenCalledTimes(1);

      fireEvent.change(input, {target: {value: message}});
      fireEvent.keyDown(input, {key: "Enter"});

      expect(mockDispatchFn).toHaveBeenCalledTimes(2);
   });

   it("should submit using the correct redux action and payload", () => {

      expect(mockDispatchFn).toHaveBeenCalledTimes(0);

      fireEvent.change(input, {target: {value: message}});
      fireEvent.keyDown(input, {key: "Enter"});

      expect(mockDispatchFn.mock.calls[0][0].payload).toEqual(message);
      expect(mockDispatchFn.mock.calls[0][0].type).toEqual("localUser/setLocalUser");
   });
});
