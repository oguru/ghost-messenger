import App from "./App";
import {Provider} from "react-redux";
import React from "react";
import {mount} from "enzyme";
import store from "./store/store.js";

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
      expect(wrapper.find("LoginBox")).toHaveLength(1);
   });

   it("should not render the LoginBox once a username has been submitted", () => {
      expect(wrapper.find("LoginBox")).toHaveLength(1);

      wrapper.find({"data-test": "loginBoxInput"}).simulate("change", {target: {value: "Donkey"}});
      wrapper.find({"data-test": "loginBoxButton"}).simulate("click");

      expect(wrapper.find("LoginBox")).toHaveLength(0);
   });
});
