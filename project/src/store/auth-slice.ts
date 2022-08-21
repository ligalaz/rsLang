import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IAuth } from "../interfaces/auth";
import { AUTH_KEY } from "../config";

interface IAuthState {
  auth: IAuth;
}

const initialState: IAuthState = {
  auth: null,
};

const actualState: IAuthState = {
  auth: JSON.parse(localStorage.getItem(AUTH_KEY)) ?? null,
};

export const authSlice = createSlice({
  initialState: actualState,
  name: "auth",
  reducers: {
    logout: () => {
      localStorage.removeItem(AUTH_KEY);
      return initialState;
    },
    setAuth: (state, action: PayloadAction<IAuth>) => {
      state.auth = action.payload;
      localStorage.setItem(AUTH_KEY, JSON.stringify(action.payload));
    },
  },
});

export default authSlice.reducer;

export const { logout, setAuth } = authSlice.actions;
