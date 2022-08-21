import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/dist/query/react";

import { IUser } from "../interfaces/user";
import { IAuth } from "../interfaces/auth";
import { HTTPMethods } from "../enums/http-methods";
import { setAuth, logout } from "../store/auth-slice";
import { API_BASE_URL } from "../config";
import { ServerRoutes } from "../enums/server-routes";

export const authService = createApi({
  reducerPath: "auth",
  baseQuery: fetchBaseQuery({
    baseUrl: API_BASE_URL,
  }),
  endpoints: (build) => ({
    createUser: build.mutation<IUser, IUser>({
      query: (user: IUser) => ({
        url: ServerRoutes.users,
        method: HTTPMethods.POST,
        body: user,
      }),
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
          dispatch(setAuth(data));
        } catch (error) {
          console.log(error);
        }
      },
    }),
    token: build.query<IAuth, string>({
      query: (id: string) =>
        `${ServerRoutes.users}/${id}${ServerRoutes.tokens}`,
      async onQueryStarted(args: string, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(setAuth(data));
        } catch (error) {
          // TODO: add 401 error handlind
          dispatch(logout());
        }
      },
    }),
  }),
});

export const { useSignInMutation, useCreateUserMutation, useTokenQuery } =
  authService;
