import Message from "./Message";
import React from "react";
import {act} from 'react-dom/test-utils';
import '@testing-library/jest-dom'
import {screen, render, RenderResult} from '@testing-library/react';

describe("Message component tests", () => {
   let wrapper: RenderResult;
   const message = "Hello";
   const name = "TestName";

   beforeEach(() => {
      jest.spyOn(global, 'setTimeout');
      jest.useFakeTimers();

      wrapper = render(<Message 
         message={message} 
         name={name} />
      )
   });

   it("Should start with translateY 35px inline style and change to 0px", async() => {
      let msgContainer = screen.getByTestId("messageContainer");

      expect(msgContainer).toHaveStyle({transform: "translateY(35px)"});

      await act(async() => {
         jest.advanceTimersByTime(100);
      });

      msgContainer = screen.getByTestId("messageContainer");

      expect(msgContainer).toHaveStyle({transform: "translateY(0px)"});
   });

   it("Should have the 'disappear' css class and translateY -100vh inline style applied after 5 seconds", async() => {
      let msgContainer = screen.getByTestId("messageContainer");
      expect(msgContainer.classList.contains("disappear")).toBe(false);
      expect(msgContainer).toHaveStyle({transform: "translateY(35px)"});

      await act(async() => {
         jest.runAllTimers();
      });
      
      expect(setTimeout).toHaveBeenCalledWith(expect.any(Function), 5000);
      
      msgContainer = screen.getByTestId("messageContainer");
      expect(msgContainer.classList.contains("disappear")).toBe(true);
      expect(msgContainer).toHaveStyle({transform: "translateY(-100vh)"});
   });
   
   it("Should display the message from props", () => {
      expect(screen.getByText(message)).toBeInTheDocument();
   });
   
   it("Should display the users name from props if altstyle is true", () => {
      expect(screen.queryByText(name)).toBeNull();

      const { rerender } = wrapper;

      rerender(<Message 
         message={message} 
         name={name}
         altStyle={true} />
      )

      expect(screen.getByText(name)).toBeInTheDocument();
   });
});