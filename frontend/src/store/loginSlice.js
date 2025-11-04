import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user_name: "Guest",
  email: null,
  role: null,
  loading: false,
  error: null,
};

export const loginSlice = createSlice({
  name: "login",
  initialState,
  reducers: {
    login_start: (state) => {
      state.loading = true;
    },
    login_end: (state, action) => {
      state.loading = false;
      console.log("action.payload.email", action.payload.email);
      state.email = action.payload.email;
      state.user_name = action.payload.user_name;
      state.role = action.payload.role;
    },
    otp_start: (state) => {
      state.loading = true;
    },
    otp_end: (state) => {
      state.loading = false;
    },
  },
});

export const { login_start, login_end, otp_start, otp_end } =
  loginSlice.actions;

export default loginSlice.reducer;
