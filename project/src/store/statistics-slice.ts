import { createSlice } from "@reduxjs/toolkit";
import { IStatistic } from "../interfaces/statistic";
import { UserWordOptions } from "../interfaces/user-word";
import { Word } from "../interfaces/word";
import { statisticsService } from "../services/statistics-service";
import { userWordsService } from "../services/user-words-service";

interface IStatisticState {
  statistics: IStatistic;
  newWords: Word[];
}

const initialState: IStatisticState = {
  statistics: null,
  newWords: null,
};

export const statisticsSlice = createSlice({
  initialState,
  name: "statistics",
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addMatcher(
        statisticsService.endpoints.getUserStatistics.matchFulfilled,
        (state, { payload }) => {
          state.statistics = payload;
        }
      )
      .addMatcher(
        statisticsService.endpoints.updateUserStatistics.matchFulfilled,
        (state, { payload }) => {
          state.statistics = payload;
        }
      )
      .addMatcher(
        statisticsService.endpoints.getNewUserWords.matchFulfilled,
        (state, { payload }) => {
          state.newWords = payload;
        }
      )
      .addMatcher(
        userWordsService.endpoints.createUserWord.matchFulfilled,
        (state, { payload }) => {
          state.newWords.push(Word.fromUserWordResponse(payload));
        }
      )
      .addMatcher(
        userWordsService.endpoints.updateUserWord.matchFulfilled,
        (state, { payload }) => {
          const word: Word = state.newWords.find(
            (newWord: Word) => newWord.id === payload.wordId
          );
          if (word) {
            word.userWord.difficulty = payload.difficulty;
            word.userWord.optional = UserWordOptions.fromServer(
              payload.optional
            );
          }
        }
      );
  },
});

export default statisticsSlice.reducer;
