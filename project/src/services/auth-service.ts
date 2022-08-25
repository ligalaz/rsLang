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
import { useNavigate } from "react-router";

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
            notify(
              "Некорректные данные ввода, повторите регистрацию",
              toast.error
            );
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
            notify("Ошибка авторизации", toast.error);
          }
          if (error.error.originalStatus === 404) {
            notify(
              "Пользователь не найден, необходима регистрация",
              toast.error
            );
          }
          if (error.error.originalStatus === 403) {
            notify("Ошибка ввода данных", toast.error);
          }
          if (error.error.originalStatus === 422) {
            notify("Длина пароля не менее 8 символов", toast.error);
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
              "Доступ отсутствует или недействителен, повторите авторизацию",
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
