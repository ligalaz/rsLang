import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/dist/query/react";
import { API_BASE_URL } from "../config";
import { HTTPMethods } from "../enums/http-methods";
import { ServerRoutes } from "../enums/server-routes";
import {
  IStatistic,
  IStatisticsRequest,
  Statistic,
} from "../interfaces/statistic";
import { IAggregatedWordsResponse } from "../interfaces/user-word";
import { IWord, Word } from "../interfaces/word";
import { RootState } from "../store/store";
import { getStartOfDayDate } from "../utils/get-start-of-day-date";
import { unauthorizedErrorHandler } from "../utils/unauthorized-error-handler";

export const statisticsService = createApi({
  reducerPath: "statistics",
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
    getUserStatistics: build.mutation<Statistic, string>({
      query: (id: string) => ({
        url: `${ServerRoutes.users}/${id}${ServerRoutes.statistics}`,
        method: HTTPMethods.GET,
      }),
      transformResponse: Statistic.fromDto,
      onQueryStarted: unauthorizedErrorHandler,
    }),
    updateUserStatistics: build.mutation<Statistic, IStatisticsRequest>({
      query: (request: IStatisticsRequest) => ({
        url: `${ServerRoutes.users}/${request.userId}${ServerRoutes.statistics}`,
        method: HTTPMethods.PUT,
        body: request.request,
      }),
      transformResponse: Statistic.fromDto,
      onQueryStarted: unauthorizedErrorHandler,
    }),
    getNewUserWords: build.mutation<Word[], string>({
      query: (id: string) => ({
        url: `${ServerRoutes.users}/${id}${ServerRoutes.aggregatedWords}`,
        method: HTTPMethods.GET,
        params: {
          filter: `{"userWord.optional.firstSeenDate": "${getStartOfDayDate()}"}`,
          wordsPerPage: 3600,
        },
      }),
      transformResponse: (response) => {
        const [results] = response as IAggregatedWordsResponse[];
        return results.paginatedResults.map((word: IWord) =>
          Word.fromServer(word)
        );
      },
      onQueryStarted: unauthorizedErrorHandler,
    }),
  }),
});

export const {
  useGetUserStatisticsMutation,
  useUpdateUserStatisticsMutation,
  useGetNewUserWordsMutation,
} = statisticsService;
