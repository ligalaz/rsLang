import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Word } from "../interfaces/word";
import { wordsService } from "../services/words-service";
import { aggregatedWordsService } from "../services/aggregated-words-service";
import { userWordsService } from "../services/user-words-service";
import {
  UserWord,
  UserWordOptions,
  UserWordResponse,
} from "../interfaces/user-word";

interface IWordsState {
  words: Word[];
}

const initialState: IWordsState = {
  words: null,
};

export const wordsSlice = createSlice({
  initialState,
  name: "words",
  reducers: {
    removeById: (state, action: PayloadAction<string>) => {
      state.words = state.words.filter(
        (word: Word) => word.id !== action.payload
      );
    },
  },
  extraReducers: (builder) => {
    builder
      .addMatcher(
        wordsService.endpoints.getWords.matchFulfilled,
        (state, { payload }) => {
          state.words = payload;
        }
      )
      .addMatcher(
        aggregatedWordsService.endpoints.getUserWords.matchFulfilled,
        (state, { payload }) => {
          state.words = payload;
        }
      )
      .addMatcher(
        userWordsService.endpoints.createUserWord.matchFulfilled,
        (state, { payload }) => {
          const word: Word = state.words.find(
            (word: Word) => word.id === (payload as UserWordResponse).wordId
          );
          if (word) {
            word.userWord = new UserWord();
            word.userWord.difficulty = payload.difficulty;
            word.userWord.optional = UserWordOptions.fromServer(
              payload.optional
            );
          }
        }
      )
      .addMatcher(
        userWordsService.endpoints.updateUserWord.matchFulfilled,
        (state, { payload }) => {
          const word: Word = state.words.find(
            (word: Word) => word.id === (payload as UserWordResponse).wordId
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

export const { removeById } = wordsSlice.actions;

export default wordsSlice.reducer;
