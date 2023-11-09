import * as firestore from "@firebase/firestore";
import * as redux from "react-redux";
import Messages from "./Messages";
import React from "react";
import {db} from "../../services/firebase";
import {mount} from "enzyme";
import store from "../../store/store";
import {screen, render, RenderResult} from "@testing-library/react";

type MockSnapshotMsg = {
   docs: {
      id: string,
      data: () => {
         message: string
      }
   }[]
}

describe("Messages tests", () => {
   let deleteDocSpy: jest.SpyInstance,
      docSpy: jest.SpyInstance,
      firestoreMock: { [key: string]: jest.Mock },
      mockDispatchFn: jest.Mock,
      mockOldSnapshotMsg: MockSnapshotMsg,
      mockSnapshotMsg: MockSnapshotMsg,
      useDispatchSpy: jest.SpyInstance,
      useSelectorSpy: jest.SpyInstance,
      wrapper: RenderResult;

   const message = "Hello";
   const user = "Dave";
   const oldTime = 1658324018384;
   const currentTime = oldTime + 5000;

   beforeEach(() => {
      useDispatchSpy = jest.spyOn(redux, "useDispatch");
      mockDispatchFn = jest.fn();
      useDispatchSpy.mockReturnValue(mockDispatchFn);

      firestoreMock = {
         setDoc: jest.fn(),
         deleteDoc: jest.fn(),
         collection: jest.fn(),
         doc: jest.fn(),
         onSnapshot: jest.fn((snapshotCallback) => snapshotCallback(mockSnapshotMsg))
      };

      useSelectorSpy = jest.spyOn(redux, "useSelector");
      useSelectorSpy.mockReturnValueOnce([]);
      useSelectorSpy.mockReturnValueOnce(user);

      jest.useFakeTimers();
      jest.setSystemTime(new Date(currentTime));

      jest.spyOn(firestore, "setDoc").mockImplementation(() => firestoreMock.setDoc as any);
      docSpy = jest.spyOn(firestore, "doc");
      docSpy.mockImplementation(() => firestoreMock.doc as any);
      deleteDocSpy = jest.spyOn(firestore, "deleteDoc");
      deleteDocSpy.mockImplementation(firestoreMock.deleteDoc);
   });

   afterEach(() => {
      jest.clearAllMocks();
      jest.runOnlyPendingTimers();
   });

   describe("New and Valid Message in Firestore", () => {
      beforeEach(() => {
         mockSnapshotMsg = {
            docs: [
               {
                  id: `${currentTime - 10}_${user}`,
                  data: jest.fn(() => {
                     return {message};
                  })
               }
            ]
         };

         Object.assign(firestoreMock, {onSnapshot: (snapshotCallback) => snapshotCallback(mockSnapshotMsg)});

         jest.spyOn(firestore, "onSnapshot").mockImplementation((_, snapshotCallback) => firestoreMock.onSnapshot(snapshotCallback));

         wrapper = mount(<redux.Provider store={store}>
            <Messages />
         </redux.Provider>);
      });

      it("should dispatch an action to set messages to the store when they are received from the firebase listener", () => {
         expect(mockDispatchFn.mock.calls[0][0].payload[0].message).toEqual(message);

         expect(mockDispatchFn.mock.calls[0][0].type).toEqual("messages/set");
      });

      it("Does not apply a transform when a single message is received", () => {
         const msg = wrapper.find(".messagesCont");

         expect(msg.props().style).toBeFalsy();
      });
   });

   describe("Old and Invalid Message in Firestore", () => {

      beforeEach(() => {
         mockOldSnapshotMsg = {
            docs: [
               {
                  id: `${oldTime}_${user}`,
                  data: jest.fn(() => {
                     return {message};
                  })
               }
            ]
         };

         Object.assign(firestoreMock, {onSnapshot: (snapshotCallback) => snapshotCallback(mockOldSnapshotMsg)});

         jest.spyOn(firestore, "onSnapshot").mockImplementation((collectionRef, snapshotCallback) => firestoreMock.onSnapshot(snapshotCallback));

         wrapper = mount(<redux.Provider store={store}>
            <Messages />
         </redux.Provider>);
      });

      it("should not save messages to the store older than 5 seconds when they are received from the firebase listener", () => {
         expect(mockDispatchFn.mock.calls[0][0].payload).toEqual([]);
      });

      it("should delete messages older than 5 seconds from firebase on load", () => {
         expect(deleteDocSpy).toHaveBeenCalled();
         expect(docSpy).toHaveBeenCalledWith(db, "messages", `${oldTime}_${user}`);
      });
   });
});