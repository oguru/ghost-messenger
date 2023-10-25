import InputBox from "./components/InputBox/InputBox";
import LoginBox from "./components/LoginBox/LoginBox";
import Messages from "./containers/Messages";
import React from "react";
import styles from "./App.module.scss";
import {useSelector} from "react-redux";
import "./GlobalStyles.module.scss";
import { RootState } from "./store/store";

const App = () => {
   const user = useSelector((state: RootState) => state.user.name);

   return (
      <div className={styles.App}>
         {!user && <LoginBox data-test="loginBox" />}
         <div className={styles.messengerContainer}>
            <h1>Ghost Messenger</h1>
            <Messages />
            <InputBox />
         </div>
      </div>
   );
};

export default App;
