import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/dist/query/react";

import { IUser } from "../interfaces/user";
import { IAuth } from "../interfaces/auth";
import { HTTPMethods } from "../enums/http-methods";
import { API_BASE_URL } from "../config";
import { ServerRoutes } from "../enums/server-routes";
import { RootState } from "../store/store";
import { toast } from "react-toastify";
import { notify } from "../utils/notifications";
import "react-toastify/dist/ReactToastify.css";
import { ApiError } from "../interfaces/ApiError";
import { logout } from "../store/auth-slice";

export const authService = createApi({
  reducerPath: "auth",
  baseQuery: fetchBaseQuery({
    baseUrl: API_BASE_URL,
    prepareHeaders: (headers, { getState }) => {
      const refreshToken: string = (getState() as RootState).authState.auth
        ?.refreshToken;
      if (refreshToken) {
        headers.set("Authorization", `Bearer ${refreshToken}`);
      }
      return headers;
    },
  }),
  endpoints: (build) => ({
    createUser: build.mutation<IUser, IUser>({
      query: (user: IUser) => ({
        url: ServerRoutes.users,
        method: HTTPMethods.POST,
        body: user,
      }),
      async onQueryStarted(args: IUser, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
        } catch (err: unknown) {
          const error = err as ApiError;

          if (error.error.status === 422) {
            notify("Incorrect input data, please re-register", toast.error);
          }
        }
      },
    }),

    signIn: build.mutation<IAuth, IUser>({
      query: (user: IUser) => ({
        url: ServerRoutes.signin,
        method: HTTPMethods.POST,
        body: user,
      }),
      async onQueryStarted(args: IUser, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
        } catch (err: unknown) {
          const error = err as ApiError;
          if (error.error.originalStatus === 401) {
            notify("Authorization Error", toast.error);
          }
          if (error.error.originalStatus === 404) {
            notify("User not found, registration required", toast.error);
          }
          if (error.error.originalStatus === 403) {
            notify("Data entry error", toast.error);
          }
          if (error.error.originalStatus === 422) {
            notify(
              "Password length must be at least 8 characters",
              toast.error
            );
          }
        }
      },
    }),
    token: build.query<IAuth, string>({
      query: (id: string) =>
        `${ServerRoutes.users}/${id}${ServerRoutes.tokens}`,
      async onQueryStarted(args: string, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
        } catch (err: unknown) {
          const error = err as ApiError;
          if (error.error.originalStatus === 401) {
            notify(
              "Access denied or invalid, please re-authorize",
              toast.error
            );
            dispatch(logout());
          }
        }
      },
    }),
  }),
});

export const { useSignInMutation, useCreateUserMutation, useTokenQuery } =
  authService;
