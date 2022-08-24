import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/dist/query/react";

import { IUser } from "../interfaces/user";
import { IAuth } from "../interfaces/auth";
import { HTTPMethods } from "../enums/http-methods";
import { API_BASE_URL } from "../config";
import { ServerRoutes } from "../enums/server-routes";
import { RootState } from "../store/store";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const notify = () => {
  toast.error("Hello world");
};

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
    }),
    signIn: build.mutation<IAuth, IUser>({
      query: (user: IUser) => ({
        url: ServerRoutes.signin,
        method: HTTPMethods.POST,
        body: user,
      }),
      // async onQueryStarted(args: IUser, { dispatch, queryFulfilled }) {
      //   try {
      //     const { data } = await queryFulfilled;

      //   } catch (error) {
      //     console.log(error);
      //   }
      // },
    }),
    token: build.query<IAuth, string>({
      query: (id: string) =>
        `${ServerRoutes.users}/${id}${ServerRoutes.tokens}`,
    }),
  }),
});

export const { useSignInMutation, useCreateUserMutation, useTokenQuery } =
  authService;
