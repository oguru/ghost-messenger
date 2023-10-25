import App from "./App";
import {Provider} from "react-redux";
import React from "react";
import {mount} from "enzyme";
import store from "./store/store.ts";
import { findByTestAttr } from "./util/testUtils";

describe("App tests", () => {
   let wrapper;

   beforeEach(() => {
      wrapper = mount(<Provider store={store}>
         <App />
      </Provider>);
   });

   afterEach(() => {
      jest.clearAllMocks();
   });

   it("should render the LoginBox", () => {
      expect(wrapper.find({"data-test": "loginBox"}).length).toBe(1);
   });

   it("should not render the LoginBox once a username has been submitted", () => {
      let loginBox = wrapper.find({"data-test": "loginBox"});
      expect(loginBox.length).toBe(1);

      findByTestAttr(wrapper, "loginBoxInput").simulate("change", {target: {value: "Test"}});
      findByTestAttr(wrapper, "loginBoxButton").simulate("click");

      loginBox = wrapper.find({"data-test": "loginBox"});

      expect(wrapper.find("loginBox").length).toBe(0);
   });
});
