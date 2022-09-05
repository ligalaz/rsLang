import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IStatistic, Statistic } from "../interfaces/statistic";
import { UserWordOptions } from "../interfaces/user-word";
import { Word } from "../interfaces/word";
import { statisticsService } from "../services/statistics-service";
import { userWordsService } from "../services/user-words-service";
import { getStartOfDayDate } from "../utils/get-start-of-day-date";

interface IStatisticState {
  statistics: Statistic;
  newWords: Word[];
}

const initialState: IStatisticState = {
  statistics: null,
  newWords: null,
};

export const statisticsSlice = createSlice({
  initialState,
  name: "statistics",
  reducers: {
    updateUserStatistics: (state, action: PayloadAction<Statistic>) => {
      state.statistics = action.payload;
    },
    reset: () => {
      return { ...initialState };
    },
  },
  extraReducers: (builder) => {
    builder
      .addMatcher(
        statisticsService.endpoints.getUserStatistics.matchFulfilled,
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
          } else if (payload.optional?.learnedDate === getStartOfDayDate()) {
            state.newWords.push(Word.fromUserWordResponse(payload));
          }
        }
      );
  },
});

export default statisticsSlice.reducer;

export const { updateUserStatistics, reset } = statisticsSlice.actions;
