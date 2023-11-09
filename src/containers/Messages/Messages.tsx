import React, {useEffect, useRef, useCallback} from "react";
import {collection, deleteDoc, doc, onSnapshot, QuerySnapshot} from "@firebase/firestore";
import {useDispatch, useSelector} from "react-redux";
import Message from "../../components/Message";
import {db} from "../../services/firebase";
import {set} from "../../store/messagesSlice";
import styles from "./Messages.module.scss";
import {RootState} from "../../store/store";
import {MessageType} from "../../type-definitions";

const Messages = () => {
   const messages = useSelector((state: RootState) => state.messages);
   const user = useSelector((state: RootState) => state.user.name);
   const lastBounds = useRef<null | DOMRect>(null);
   const prevMessagesSize = useRef<number>(messages.length);
   const dispatch = useDispatch();

   useEffect(() => {
      const unsubscribe = onSnapshot(
         collection(db, "messages"),
         (snapshot: QuerySnapshot<any>) => {
            const docs = snapshot.docs
               .map((document) => {
                  const [key, msgOwner] = document.id.split("_");

                  // Remove messages from db that are older than 5s
                  if (Number(key) + 5000 <= new Date().getTime()) {
                     deleteDoc(doc(db, "messages", document.id));
                     return null;
                  }

                  const messageData: MessageType = {
                     ...document.data(),
                     name: msgOwner,
                     key
                  };

                  return messageData;
               })
               .filter((val) => val !== null);

            dispatch(set(docs as MessageType[]));
         }
      );

      return () => {
         unsubscribe();
      };
   }, []);

   const getInvertedTransform = (
      startBounds: DOMRect,
      endBounds: DOMRect
   ): number => startBounds.height - endBounds.height;

   const messagesContRef = useCallback((node: HTMLDivElement | null) => {
      if (node === null) {
         return;
      }

      const bounds = node.getBoundingClientRect();

      // If more than 1 message is present and a message has been added
      if (lastBounds.current !== bounds &&
         messages.length > prevMessagesSize.current
      ) {
         const invertedTransform = getInvertedTransform(lastBounds.current as DOMRect, bounds);

         lastBounds.current = bounds;

         node.animate(
            [
               {transform: `translateY(${-invertedTransform}px)`},
               {transform: `translateY(0px)`}
            ],
            500
         );
      }

      prevMessagesSize.current = messages.length;
      lastBounds.current = bounds;
   }, [messages]);

   return (
      <div className={styles.messagesBg}>
         <div
            className={`messagesCont ${styles.messagesCont}`}
            ref={messagesContRef}
         >
            { user ?
               messages.map(({key, message, name}) => (
                  <Message
                     altStyle={name !== user}
                     key={key}
                     message={message}
                     name={name}
                  />
               )) : ""
            }
         </div>
      </div>
   );
};

export default Messages;
