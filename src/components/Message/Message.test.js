import {mount, shallow} from "enzyme";
import Message from "./Message";
import React from "react";
import {act} from 'react-dom/test-utils';
import { findByTestAttr } from "../../util/testUtils";
import '@testing-library/jest-dom'

describe("Message component tests", () => {
   let wrapper;
   const message = "Hello";
   const index = 0;

   beforeEach(() => {
      jest.spyOn(global, 'setTimeout');
      jest.useFakeTimers();

      wrapper = mount(<Message
         message={message}
         index={index}
      />);
   });

   it("Should start with translateY 35px inline style and change to 0px", async() => {
      let msgContainer = findByTestAttr(wrapper, "messageContainer");

      expect(msgContainer.props().style).toEqual({transform: "translateY(35px)"});

      await act(async() => {
         jest.advanceTimersByTime(100);
         wrapper.update();
      });


      msgContainer = findByTestAttr(wrapper, "messageContainer");

      expect(msgContainer.props().style).toEqual({transform: "translateY(0px)"});
   });

   it("Should have the 'disappear' css class and translateY -100vh inline style applied after 5 seconds", async() => {
      let msgContainer = findByTestAttr(wrapper, "messageContainer");
      
      expect(msgContainer.hasClass("disappear")).toBe(false);
      expect(msgContainer.props().style).toEqual({transform: "translateY(35px)"});

      await act(async() => {
         jest.runAllTimers();
         wrapper.update();
      });
      
      expect(setTimeout).toHaveBeenCalledWith(expect.any(Function), 5000);
      
      msgContainer = findByTestAttr(wrapper, "messageContainer");
      expect(msgContainer.props().style).toEqual({transform: "translateY(-100vh)"});
      expect(msgContainer.hasClass("disappear")).toBe(true);
   });
   
   it("Should display the message from props", async() => {
      wrapper = shallow(<Message
         message={message}
         index={index}
      />);

      const msg = findByTestAttr(wrapper, "message");

      expect(msg.text()).toEqual(message);
   });
});