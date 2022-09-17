import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/dist/query/react";
import { API_BASE_URL } from "../config";
import { HTTPMethods } from "../enums/http-methods";
import { ServerRoutes } from "../enums/server-routes";
import { IUserWord, UserWordResponse } from "../interfaces/user-word";
import { RootState } from "../store/store";
import { unauthorizedErrorHandler } from "../utils/unauthorized-error-handler";

export const userWordsService = createApi({
  reducerPath: "user-words",
  baseQuery: fetchBaseQuery({
    baseUrl: API_BASE_URL,
    prepareHeaders: (headers, { getState }) => {
      const token: string = (getState() as RootState).authState.auth
        ?.token as string;
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  endpoints: (build) => ({
    getUserWords: build.mutation<IUserWord[], string>({
      query: (id: string) => ({
        url: `${ServerRoutes.users}/${id}${ServerRoutes.words}`,
        method: HTTPMethods.GET,
      }),
      onQueryStarted: unauthorizedErrorHandler,
    }),
    getUserWordById: build.query<UserWordResponse, UserWordResponse>({
      query: (userWord: UserWordResponse) =>
        `${ServerRoutes.users}/${userWord.id}${ServerRoutes.words}/${userWord.wordId}`,
      onQueryStarted: unauthorizedErrorHandler,
    }),
    createUserWord: build.mutation<UserWordResponse, UserWordResponse>({
      query: (userWord) => ({
        url: `${ServerRoutes.users}/${userWord.id}${ServerRoutes.words}/${userWord.wordId}`,
        method: HTTPMethods.POST,
        body: {
          difficulty: userWord.difficulty,
          optional: userWord.optional,
        },
      }),
      onQueryStarted: unauthorizedErrorHandler,
    }),
    updateUserWord: build.mutation<UserWordResponse, UserWordResponse>({
      query: (userWord) => ({
        url: `${ServerRoutes.users}/${userWord.id}${ServerRoutes.words}/${userWord.wordId}`,
        method: HTTPMethods.PUT,
        body: {
          difficulty: userWord.difficulty,
          optional: userWord.optional,
        },
      }),
      onQueryStarted: unauthorizedErrorHandler,
    }),
    deleteUserWord: build.mutation<UserWordResponse, UserWordResponse>({
      query: (userWord) => ({
        url: `${ServerRoutes.users}/${userWord.id}${ServerRoutes.words}/${userWord.wordId}`,
        method: HTTPMethods.DELETE,
      }),
      onQueryStarted: unauthorizedErrorHandler,
    }),
  }),
});

export const {
  useGetUserWordByIdQuery,
  useGetUserWordsMutation,
  useCreateUserWordMutation,
  useUpdateUserWordMutation,
  useDeleteUserWordMutation,
} = userWordsService;
