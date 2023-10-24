import {mount, shallow} from "enzyme";
import Message from "./Message";
import React from "react";
import {act} from "react-dom/test-utils";
import { findByTestAttr } from "../../util/testUtils";

jest.useFakeTimers();
jest.spyOn(global, 'setTimeout');

describe("Message component tests", () => {
   let wrapper;
   const message = "Hello";
   const index = 0;

   it("Should display the message from props", () => {
      wrapper = shallow(<Message
         message={message}
         index={index}
      />);

      const msg = findByTestAttr(wrapper, "message");

      expect(msg.text()).toEqual(message);
   });

   
   beforeEach(() => {
      wrapper = mount(<Message
         message={message}
         index={index}
      />);
   });

   it("Should have the 'disappear' css class applied after 5 seconds", () => {
      // let msgContainer = wrapper.find(".messageCont");
      let msgContainer = findByTestAttr(wrapper, "messageContainer");

      console.log("-------------------------------------------------------------------------------------------------------");
      console.log('msgContainer:', msgContainer.debug())
      console.log("-------------------------------------------------------------------------------------------------------");

      expect(msgContainer.hasClass("disappear")).toBe(false);

      act(() => {
         jest.runAllTimers();
         wrapper.update();
      });
      
      // msgContainer = wrapper.find(".messageCont");
      msgContainer = findByTestAttr(wrapper, "messageContainer");

      expect(setTimeout).toHaveBeenCalledWith(expect.any(Function), 5000);
      expect(msgContainer.hasClass("disappear")).toBe(true);
   });

   it("Should start with translateY 35px inline style and change to 0px", () => {

      const msg = wrapper.find("p");

      expect(msg.props().style).toEqual({transform: "translateY(35px)"});

      act(() => {
         jest.advanceTimersByTime(2);
      });
      wrapper.update();

      expect(wrapper.find("p").props().style).toEqual({transform: "translateY(0px)"});
   });

   it("Should have translateY -100vh inline style after 5s", () => {

      const msg = wrapper.find("p");

      expect(msg.props().style).toEqual({transform: "translateY(35px)"});

      act(() => {
         jest.advanceTimersByTime(5000);
      });

      wrapper.update();

      const newMsgPos = "-100vh";

      expect(wrapper.find("p").props().style).toEqual({transform: `translateY(${newMsgPos})`});
   });
});