// Marina
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  status: false, // not logged in
  userData: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action) => {
      state.status = true;
      state.userData = action.payload;
    },
    logout: (state) => {
      state.status = false;
      state.userData = null;
    },
    updateUser: (state, action) => {
      // Update userData with new info
      state.userData = {
        ...state.userData,
        ...action.payload,
      };
    },
  },
});

export const { login, logout, updateUser } = authSlice.actions;
export default authSlice.reducer;
