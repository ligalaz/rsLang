import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/dist/query/react";
import { API_BASE_URL } from "../config";
import { HTTPMethods } from "../enums/http-methods";
import { ServerRoutes } from "../enums/server-routes";
import { IAggregatedWordsResponse } from "../interfaces/user-word";
import { GetUserWordsRequest, IWord, Word } from "../interfaces/word";
import { RootState } from "../store/store";
import { unauthorizedErrorHandler } from "../utils/unauthorized-error-handler";

export const aggregatedWordsService = createApi({
  reducerPath: "user-aggregated-words",
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
    getUserWords: build.mutation<Word[], GetUserWordsRequest>({
      query: (request: GetUserWordsRequest) => ({
        url: `${ServerRoutes.users}/${request.userId}${ServerRoutes.aggregatedWords}`,
        method: HTTPMethods.GET,
        params: request.params,
      }),
      transformResponse: (response) => {
        const [results] = response as IAggregatedWordsResponse[];
        return results.paginatedResults.map((word: IWord) =>
          Word.fromServer(word)
        );
      },
      onQueryStarted: unauthorizedErrorHandler,
    }),
    // getUserWordById: build.mutation<IUserWord, UserWordResponse>({
    //   query: (userWord: UserWordResponse) =>
    //     `${ServerRoutes.users}/${userWord.id}${ServerRoutes.words}/${userWord.wordId}`,
    //   onQueryStarted: unauthorizedErrorHandler,
    // }),
  }),
});

export const { useGetUserWordsMutation } = aggregatedWordsService;
