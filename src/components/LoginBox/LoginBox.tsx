import React, {useState} from "react";
import globalStyles from "../../GlobalStyles.module.scss";
import {setLocalUser} from "../../store/userSlice";
import styles from "./LoginBox.module.scss";
import {useDispatch} from "react-redux";
import { TextInputType } from "../../type-definitions";
import { isKeyboardEvent } from "../../util/utils";

type SubmitEvent = React.MouseEvent<HTMLButtonElement, MouseEvent>

const LoginBox = () => {
   const [name, setName] = useState("");
   const dispatch = useDispatch();

   const handleSubmit = (e?: SubmitEvent) => {
      if (e) {
         e.preventDefault();
      }

      if (name.length) {
         dispatch(setLocalUser(name));
      }
   };

   const handleInput = (e: TextInputType) => {
      if (isKeyboardEvent(e) && e.key === "Enter") {
         handleSubmit();
      } else {
         setName(e.currentTarget.value);
      }
   };

   return (
      <div className={styles.loginContainer}>
         <form className={styles.loginBox}>
            <h3>Name</h3>
            <p>Please enter a display name</p>
            <div className={
               `${globalStyles.inputCont} 
                ${styles.noBorder}`
            }>
               <input
                  aria-label="Name input field"
                  onKeyDown={e => handleInput(e)}
                  onChange={e => handleInput(e)}
               />
               <button
                  aria-label="Name submit button"
                  onClick={e => handleSubmit(e)}
               >
                  Submit
               </button>
            </div>
         </form>
      </div>
   );
};

export default LoginBox;
