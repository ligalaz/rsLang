import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { GetWordsRequest, IWord, Word } from "../interfaces/word";
import { CUSTOM_API_BASE_URL } from "../config";
import { ServerRoutes } from "../enums/server-routes";
import { HTTPMethods } from "../enums/http-methods";

export const wordsService = createApi({
  reducerPath: "words",
  baseQuery: fetchBaseQuery({
    baseUrl: CUSTOM_API_BASE_URL,
  }),
  endpoints: (build) => ({
    getWords: build.mutation<Word[], GetWordsRequest>({
      query: (params: GetWordsRequest) => ({
        url: ServerRoutes.words,
        method: HTTPMethods.GET,
        params,
      }),
      transformResponse: (response) =>
        (response as IWord[]).map((word: IWord) => Word.fromServer(word)),
    }),
    getWordById: build.query<IWord, string>({
      query: (id: string) => `${ServerRoutes.words}/${id}`,
    }),
  }),
});

export const { useGetWordsMutation, useGetWordByIdQuery } = wordsService;
