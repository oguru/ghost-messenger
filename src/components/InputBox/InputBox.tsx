import 'regenerator-runtime/runtime';
import React, {useEffect, useState} from "react";
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import {deleteDoc, doc, setDoc} from "@firebase/firestore";
import {db} from "../../services/firebase";
import {useSelector} from "react-redux";
import inputBoxStyles from "./InputBox.module.scss";
import Microphone from "../../assets/mic-icon-black.svg";
import styles from "../../GlobalStyles.module.scss";
import { RootState } from "../../store/store";
import { TextInputType } from "../../type-definitions";

const InputBox = () => {
   const [message, setMessage] = useState("");
   const [isListening, setIsListening] = useState(false);
   const user = useSelector((state: RootState) => state.user.name);
   const {
     transcript,
     listening,
     resetTranscript,
     browserSupportsSpeechRecognition
   } = useSpeechRecognition();

   useEffect(() => {
      if (!listening && transcript) {
        setMessage(transcript);
      }

      setIsListening(listening);
    }, [transcript, listening]);

   const sendMessage = () => {
      if (message && user) {
         const key = `${new Date().getTime().toString()}_${user}`;

         setDoc(doc(db, "messages", key), {
            // name: user,
            message
         });
         setMessage("");
         setTimeout(() => {
            deleteDoc(doc(db, "messages", key));
         }, 8000);
      }
   };

   const handleInput = (e: TextInputType) => {
      const isKeyboardEvent = (
         e: TextInputType): e is React.KeyboardEvent<HTMLInputElement> => {
         return 'key' in e;
      }

      if (isKeyboardEvent(e) && e.key === "Enter") {
         sendMessage();
      } else {
         setMessage(e.currentTarget.value);
      }
   };

   const handleAudioInput = () => {
      if (isListening) {
         SpeechRecognition.stopListening();
         resetTranscript();
      } else {
         SpeechRecognition.startListening();
      }
   }

   return (
      <div className={styles.inputCont}>
         <input
            aria-label="Message input field"
            value={message}
            type="text"
            onKeyDown={(e) => handleInput(e)}
            onChange={(e) => handleInput(e)}
         />
         {browserSupportsSpeechRecognition && (
            <button 
               className={`
                  ${isListening && inputBoxStyles.micBtnListening} 
                  ${inputBoxStyles.micBtn}
               `} 
               onClick={() => handleAudioInput()}
            >
               <img src={Microphone} alt="Microphone Icon" />
            </button>
         )}
         <button onClick={() => sendMessage()}>Send</button>
      </div>
   );
};

export default InputBox;
