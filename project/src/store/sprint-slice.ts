import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../store/store";
import { IWord } from "../interfaces/word";

interface SprintState {
  isGameStarted: boolean;
  isResultsShown: boolean;
  data: IWord[];
  gameData: IWord[];
  trueAnswers: IWord[];
  falseAnswers: IWord[];
  score: number;
}

const initialState: SprintState = {
  isGameStarted: false,
  isResultsShown: false,
  data: [],
  gameData: [],
  trueAnswers: [],
  falseAnswers: [],
  score: 0,
};

export const sprintSlice = createSlice({
  name: "sprint",
  initialState,
  reducers: {
    startGame: (state, { payload }) => {
      state.isGameStarted = true;
      state.data = payload;
    },
    finishGame: (state) => {
      state.isGameStarted = false;
    },
    switchResultsVisibility: (state) => {
      state.isResultsShown = !state.isResultsShown;
    },
    increaseScore: (state, { payload = 0 }) => {
      state.score += payload;
    },
  },
});

export const sprintActions = sprintSlice.actions;

export default sprintSlice.reducer;
