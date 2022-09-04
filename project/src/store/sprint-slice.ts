import { createSlice } from "@reduxjs/toolkit";
import { IWord } from "../interfaces/word";
import { gameStep } from "./audiocall-slice";
interface SprintState {
  timer: number;
  delay: number;
  timerCircle: number;
  isGameStarted: boolean;
  isGameEnded: boolean;
  currentWord: {
    word: string;
    wordTranslate: string;
  };
  wordsData: IWord[];
  filterWordsData: IWord[];
  gameData: IWord[];
  trueAnswers: IWord[];
  trueAnswersCount: number;
  falseAnswers: IWord[];
  score: number;
}

const initialState: SprintState = {
  timer: 60,
  delay: 1000,
  timerCircle: 100,
  isGameStarted: false,
  isGameEnded: false,
  currentWord: {
    word: "",
    wordTranslate: "",
  },
  wordsData: [],
  filterWordsData: [],
  gameData: [],
  trueAnswers: [],
  trueAnswersCount: 0,
  falseAnswers: [],
  score: 0,
};

const getRandNumber = (max = 1, min = 0): number => {
  return Math.floor(min + Math.random() * (max + 1 - min));
};

export const sprintSlice = createSlice({
  name: "sprint",
  initialState,
  reducers: {
    setGameEnd: (state) => {
      state.isGameEnded = true;
    },
    resetGame: (state) => {
      return initialState;
    },
    gameStep: (state) => {
      const { filterWordsData, isGameEnded } = state;

      if (!isGameEnded) {
        const rightAnswerStates = Boolean(getRandNumber());
        const rand = getRandNumber(filterWordsData.length - 1);

        const randWordData = filterWordsData.at(rand);
        state.filterWordsData = [
          ...filterWordsData.slice(0, rand),
          ...filterWordsData.slice(rand + 1),
        ];

        state.gameData.push(randWordData);

        let { wordTranslate } = randWordData;

        if (!rightAnswerStates) {
          const { filterWordsData } = state;
          wordTranslate = filterWordsData.at(
            getRandNumber(filterWordsData.length - 1)
          ).wordTranslate;
        }

        state.currentWord = { word: randWordData.word, wordTranslate };
      }
    },
    startGame: (state, { payload }: { payload: IWord[] }) => {
      state.isGameStarted = true;
      state.wordsData = payload;
      state.filterWordsData = payload;
    },
    restartGame: (state) => {
      return {
        ...initialState,
        wordsData: state.wordsData,
        filterWordsData: state.wordsData,
        isGameStarted: true,
      };
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
