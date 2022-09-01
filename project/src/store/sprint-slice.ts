import { createSlice } from "@reduxjs/toolkit";
import { IWord } from "../interfaces/word";

interface SprintState {
  isGameStarted: boolean;
  isResultsShown: boolean;
  level: string;
  page: string;
  currentWord: {
    word: string;
    wordTranslate: string;
  };
  wordsData: IWord[];
  gameData: IWord[];
  trueAnswers: IWord[];
  trueAnswersCount: number;
  falseAnswers: IWord[];
  score: number;
}

const initialState: SprintState = {
  isGameStarted: false,
  isResultsShown: false,
  level: "1",
  page: "1",
  currentWord: {
    word: "",
    wordTranslate: "",
  },
  wordsData: [],
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
    getData: (state, { payload }: { payload: IWord[] }) => {
      state.wordsData = payload;
    },
    setLevel: (state, { payload }: { payload: string }) => {
      state.level = payload;
    },
    setGameState: (state) => {
      state.isGameStarted = !state.isGameStarted;
    },
    showResults: (state) => {
      state.isResultsShown = !state.isResultsShown;
    },
    resetGame: (state) => {
      return { ...initialState, level: state.level };
    },
    gameStep: (state) => {
      const { wordsData } = state;

      const getRandNumber = (max = 1, min = 0): number => {
        return Math.floor(min + Math.random() * (max + 1 - min));
      };

      const rightAnswerStates = Boolean(getRandNumber());

      const randWordNumber = getRandNumber(wordsData.length - 1);
      const randWordData = wordsData.at(randWordNumber);
      state.gameData.push(randWordData);

      let { wordTranslate } = randWordData;

      if (!rightAnswerStates) {
        wordTranslate = [
          ...wordsData.slice(0, randWordNumber),
          ...wordsData.slice(randWordNumber + 1),
        ].at(getRandNumber(wordsData.length - 2)).wordTranslate;
      }

      state.currentWord = { word: randWordData.word, wordTranslate };
    },
    changeGameScore: (state, { payload }: { payload: boolean }) => {
      const wordData = state.gameData.at(-1);

      if (payload) {
        state.trueAnswersCount += 1;
        const { trueAnswersCount } = state;
        let points = 10;

        if (trueAnswersCount > 9) {
          points = 80;
        } else if (trueAnswersCount > 6) {
          points = 40;
        } else if (trueAnswersCount > 3) {
          points = 20;
        }

        state.score += points;
        state.trueAnswers.push(wordData);
      } else {
        state.trueAnswersCount = 0;
        state.falseAnswers.push(wordData);
      }
    },
  },
});

export const sprintActions = sprintSlice.actions;

export default sprintSlice.reducer;
