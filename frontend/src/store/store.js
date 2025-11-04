import { configureStore } from "@reduxjs/toolkit";
import loginReduser from "./loginSlice.js";

export const store = configureStore({
  reducer: {
    login: loginReduser,
  },
});
