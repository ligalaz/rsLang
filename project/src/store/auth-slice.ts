import { createSlice } from "@reduxjs/toolkit";
import { IAuth } from "../interfaces/auth";
import { AUTH_KEY } from "../config";
import { authService } from "../services/auth-service";
import { store } from "../index";

interface IAuthState {
  auth: IAuth;
}

let timerId: number | null = null;

const createTimer = (callback: VoidFunction) => {
  timerId = window.setTimeout(() => {
    callback();
    clearTimer();
  }, 1000 * 60 * 60 * 4);
};

const clearTimer = () => {
  window.clearTimeout(timerId as number);
  timerId = null;
};

const initialState: IAuthState = {
  auth: null,
};

const actualState: IAuthState = {
  auth: JSON.parse(localStorage.getItem(AUTH_KEY) as string) ?? null,
};

export const authSlice = createSlice({
  initialState: actualState,
  name: "auth",
  reducers: {
    logout: () => {
      localStorage.removeItem(AUTH_KEY);
      return initialState;
    },
  },
  extraReducers: (builder) => {
    builder
      .addMatcher(
        authService.endpoints.signIn.matchFulfilled,
        (state, { payload }) => {
          state.auth = payload;
          localStorage.setItem(AUTH_KEY, JSON.stringify(payload));

          createTimer(() => {
            store.dispatch(
              authService.endpoints.token.initiate(payload.userId)
            );
          });
        }
      )
      .addMatcher(
        authService.endpoints.token.matchFulfilled,
        (state, { payload }) => {
          state.auth!.token = payload.token;
          state.auth!.refreshToken = payload.refreshToken;
          localStorage.setItem(AUTH_KEY, JSON.stringify(state.auth));

          createTimer(() => {
            store.dispatch(
              authService.endpoints.token.initiate(payload.userId)
            );
          });
        }
      )
      .addMatcher(authService.endpoints.token.matchRejected, () => {
        localStorage.removeItem(AUTH_KEY);
        clearTimer();
        return initialState;
      });
  },
});

export default authSlice.reducer;

export const { logout } = authSlice.actions;
