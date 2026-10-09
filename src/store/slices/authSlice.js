import { createSlice } from "@reduxjs/toolkit";
import { STORAGE_KEYS } from "../../constants";
import { readStorage, writeStorage, removeStorage } from "../../utils/storage";

const storedSession = readStorage(STORAGE_KEYS.SESSION, null);

const initialState = {
  user: storedSession,
  isAuthenticated: Boolean(storedSession)
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginSuccess: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = true;
      writeStorage(STORAGE_KEYS.SESSION, action.payload);
    },
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      removeStorage(STORAGE_KEYS.SESSION);
    }
  }
});

export const { loginSuccess, logout } = authSlice.actions;
export default authSlice.reducer;
