import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { IWord } from "../interfaces/word";
import { API_BASE_URL } from "../config";
import { ServerRoutes } from "../enums/server-routes";

export const wordsService = createApi({
  reducerPath: "words",
  baseQuery: fetchBaseQuery({
    baseUrl: API_BASE_URL,
  }),
  endpoints: (build) => ({
    getWords: build.query<IWord[], number[]>({
      query: ([group, page]: number[]) => ({
        url: ServerRoutes.words,
        params: {
          group,
          page,
        },
      }),
    }),
    getWordById: build.query<IWord, string>({
      query: (id: string) => `${ServerRoutes.words}/${id}`,
    }),
  }),
});

export const { useGetWordsQuery, useGetWordByIdQuery } = wordsService;
