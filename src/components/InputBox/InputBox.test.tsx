import 'regenerator-runtime/runtime';
import * as firestore from "@firebase/firestore";
import {SetOptions, DocumentReference, Firestore} from "@firebase/firestore";
import * as redux from "react-redux";
import SpeechRecognition, {useSpeechRecognition} from "react-speech-recognition";
// import SpeechRecognition, {useSpeechRecognition} from "react-speech-recognition";
import InputBox from "./InputBox";
import React from "react";
import {db} from "../../services/firebase";
import store from "../../store/store";
import {screen, render, fireEvent} from '@testing-library/react';

// type SetDocMock = jest.SpyInstance<
//    Promise<void>, 
//    [reference: 
//       DocumentReference<unknown>, 
//       data: Partial<unknown>, 
//       options: SetOptions
//    ]
// >;


// jest.SpyInstance<
//    firestore.DocumentReference<firestore.DocumentData>, 
//    [
//       reference: DocumentReference<unknown>, 
//       path: string, 
//       ...pathSegments: string[]
//    ], 
//    any
// >;


// type DocMock = {
//    reference: DocumentReference<unknown>, 
//    path: string, 
//    pathSegments: string[]
// }

// type DocMockArgs = {
//    // reference: DocumentReference<unknown>, 
//    firestore: Firestore;
//    path: string, 
//    pathSegments: string[]
// }

describe("Input Box tests", () => {
   let deleteDocSpy: jest.SpyInstance,
      docMock: jest.SpyInstance,
      firestoreMock: {[key: string]: jest.Mock},
      input: HTMLInputElement,
      key: string,
      setDocMock: jest.SpyInstance,
      useSelectorSpy: jest.SpyInstance,
      useSpeechRecognitionMock,
      useSpeechRecognitionSpy,
      browserSupportsSpeechRecognitionSpy,
      speechRecListeningSpy;

   const message = "Hello";
   const transcriptMessage = "Spoken hello";
   const user = "Dave";

   beforeEach(() => {

      firestoreMock = {
         setDoc: jest.fn(),
         deleteDoc: jest.fn(),
         collection: jest.fn(),
         doc: jest.fn(),
      };

      useSpeechRecognitionMock = {
         browserSupportsSpeechRecognition: true,
         listening: jest.fn(),
         resetTranscript: jest.fn(),
         startListening: jest.fn(),
         stopListening: jest.fn(),
         transcript: transcriptMessage,
      }

      jest.mock("react-speech-recognition", () => {
         const originalModule = jest.requireActual("react-speech-recognition");

         return {
            __esModule: true,
            ...originalModule,
            useSpeechRecognition: () => {
               const useSpeechRecognition = originalModule.useSpeechRecognition();

               return {
                  ...useSpeechRecognition,
                  browserSupportsSpeechRecognition: true,
               }
            }
         }
      });

      // speechRecListeningSpy = jest.spyOn(SpeechRecognition, "listening");
      // speechRecListeningSpy.mockImplementation(useSpeechRecognitionMock.startListening);

      useSelectorSpy = jest.spyOn(redux, "useSelector");
      useSelectorSpy.mockReturnValue(user);

      // useSpeechRecognitionSpy = jest.spyOn(useSpeechRecognition);
      // useSpeechRecognitionSpy.mockImplementation(() => useSpeechRecognitionMock)

      jest.useFakeTimers();
      jest.setSystemTime(new Date(2020, 3, 1));

      key = `${new Date().getTime().toString()}_${user}`;

      setDocMock = jest.spyOn(firestore, "setDoc")
      docMock = jest.spyOn(firestore, "doc")
      docMock.mockImplementation(() => firestoreMock.doc as any);
      deleteDocSpy = jest.spyOn(firestore, "deleteDoc")
      deleteDocSpy.mockImplementation(firestoreMock.deleteDoc);

      render(<redux.Provider store={store}>
               <InputBox />
            </redux.Provider>)

      input = screen.getByLabelText("Message input field");
   });

   afterEach(() => {
      jest.clearAllMocks();
      jest.runOnlyPendingTimers();
   });

   it("should not send a message when the input field is empty", () => {
      const button = screen.getByLabelText("Send message");

      fireEvent.click(button);
      fireEvent.keyDown(input, {key: "Enter"});

      expect(docMock).toHaveBeenCalledTimes(0);
      expect(setDocMock).toHaveBeenCalledTimes(0);
   });

   it("should clear the input when pressing 'Enter' or clicking 'Send' with the input field populated", () => {
      fireEvent.change(input, {target: {value: message}});
      input = screen.getByLabelText("Message input field");

      expect(input.value).toBe(message);

      fireEvent.keyDown(input, {key: "Enter"});
      input = screen.getByLabelText("Message input field");

      expect(input.value).toBe("");

      fireEvent.change(input, {target: {value: message}});

      expect(input.value).toBe(message);

      const button = screen.getByLabelText("Send message");
      fireEvent.click(button);
      input = screen.getByLabelText("Message input field");

      expect(input.value).toBe("");
   });

   it("should add a message to firestore with the correct data when it has been submitted", () => {
      fireEvent.change(input, {target: {value: message}});
      fireEvent.keyDown(input, {key: "Enter"});

      expect(docMock).toHaveBeenCalledWith(db, "messages", key);
      expect(setDocMock).toHaveBeenCalledWith(firestoreMock.doc, {message});
   });

   it("should remove the message from firestore after 8 seconds", () => {
      fireEvent.change(input, {target: {value: message}});
      fireEvent.keyDown(input, {key: "Enter"});
      jest.advanceTimersByTime(7999);

      expect(docMock).toHaveBeenCalledTimes(1);
      expect(docMock).toHaveBeenCalledWith(db, "messages", key);
      expect(deleteDocSpy).toHaveBeenCalledTimes(0);

      jest.advanceTimersByTime(1);

      expect(docMock).toHaveBeenCalledTimes(2);
      expect(docMock).toHaveBeenLastCalledWith(db, "messages", key);
      expect(deleteDocSpy).toHaveBeenCalledWith(firestoreMock.doc);
   });
});

// TODO: Fix and add more tests for react speech recognition:

   // if("should set the correct classname on the microphone button when it is clicked", () => {
   //    const button = screen.getByLabelText("Microphone button");

   //    expect(button.classList.contains("micBtnListening")).toBe(false);

   //    fireEvent.click(button);

   //    expect(button.classList.contains("micBtnListening")).toBe(true);

   // });