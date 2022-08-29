import { createSlice } from "@reduxjs/toolkit";
import { IWord } from "../interfaces/word";

interface SprintState {
  isGameStarted: boolean;
  isResultsShown: boolean;
  level: number;
  gameData: IWord[];
  trueAnswers: IWord[];
  trueAnswersCount: number;
  falseAnswers: IWord[];
  score: number;
}

const initialState: SprintState = {
  isGameStarted: false,
  isResultsShown: false,
  level: 1,
  gameData: [],
  trueAnswers: [],
  trueAnswersCount: 0,
  falseAnswers: [],
  score: 0,
};

export const sprintSlice = createSlice({
  name: "sprint",
  initialState,
  reducers: {
    setLevel: (state, { payload }) => {
      state.level = payload;
    },
    startGame: (state) => {
      state.isGameStarted = true;
    },
    showResults: (state) => {
      state.isResultsShown = true;
    },
    resetGame: (state) => {
      return { ...initialState, level: state.level };
    },
    increaseScore: (state, { payload = 0 }) => {
      state.score += payload;
    },
    addGameData: (state, { payload }) => {
      state.gameData.push(payload);
    },
    increaseTrueAnswersCount: (state) => {
      state.trueAnswersCount += 1;
    },
    resetTrueAnswersCount: (state) => {
      state.trueAnswersCount = 0;
    },
    addTrueAnswers: (state, { payload }) => {
      state.trueAnswers.push(payload);
    },
    addFalseAnswers: (state, { payload }) => {
      state.falseAnswers.push(payload);
    },
  },
});

export const sprintActions = sprintSlice.actions;

export default sprintSlice.reducer;
