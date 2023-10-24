import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import { MessageType } from "../type-definitions";

const messages = createSlice({
   name: "messages",
   initialState: [] as MessageType[],
   reducers: {
      set: (_: any, action: PayloadAction<MessageType[]>) => {
         return action.payload;
      }
   }
});

export const {set} = messages.actions;

export default messages.reducer;
