import React, {useState, useEffect} from "react";
import PropTypes from "prop-types";
import ghost1 from "../../assets/ghost-1.png";
import ghost2 from "../../assets/ghost-2.png";
import styles from "./Message.module.scss";

type MessageProps = {
   altStyle: boolean;
   message: string;
   name: string;
};

const Message = ({altStyle, message, name}: MessageProps) => {
   const [pos, setPos] = useState("35px");
   const [removing, setRemove] = useState(false);
       
   useEffect(() => {
      setTimeout(() => { setPos("0px") }, 40);

      const messageOutTimeout = setTimeout(() => {
         setRemove(true);
         setPos("-100vh");
      }, 5000);

      return () => clearTimeout(messageOutTimeout)
   }, []);

   return (
      <>
         <div
            className={`
               ${styles.messageCont} 
               ${removing ? styles.disappear : ""} 
               ${altStyle ? styles.leftPos : ""}`}
            style={{transform: `translateY(${pos})`}}
         >
            <p>{message}</p>
            {altStyle && (
               <p className={`
                  ${styles.username}`
               }>
                  {name}
               </p>)}
         </div>
         <img
            alt="ghost"
            className={altStyle ? styles.leftPos : ""}
            src={Math.random() > 0.5 ? ghost1 : ghost2}
         />
      </>
   );
};

export default Message;
