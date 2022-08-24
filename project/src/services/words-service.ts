import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { GetWordsRequest, IWord } from "../interfaces/word";
import { API_BASE_URL } from "../config";
import { ServerRoutes } from "../enums/server-routes";
import { HTTPMethods } from "../enums/http-methods";

export const wordsService = createApi({
  reducerPath: "words",
  baseQuery: fetchBaseQuery({
    baseUrl: API_BASE_URL,
  }),
  endpoints: (build) => ({
    getWords: build.query<IWord[], GetWordsRequest>({
      query: (params: GetWordsRequest) => ({
        url: ServerRoutes.words,
        method: HTTPMethods.GET,
        params,
      }),
    }),
    getWordById: build.query<IWord, string>({
      query: (id: string) => `${ServerRoutes.words}/${id}`,
    }),
  }),
});

export const { useGetWordsQuery, useGetWordByIdQuery } = wordsService;
