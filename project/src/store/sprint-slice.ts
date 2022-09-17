import { createSlice } from "@reduxjs/toolkit";
import { IWord } from "../interfaces/word";
import { shuffle } from "../utils/shuffle";

interface SprintState {
  isGameStarted: boolean;
  isGameEnded: boolean;
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
  isGameEnded: false,
  level: "0",
  page: "0",
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

const getRandNumber = (max = 1, min = 0): number => {
  return Math.floor(min + Math.random() * (max + 1 - min));
};

export const sprintSlice = createSlice({
  name: "sprint",
  initialState,
  reducers: {
    getData: (state, { payload }: { payload: IWord[] }) => {
      state.wordsData = shuffle([...payload]);
    },
    setLevel: (
      state,
      { payload }: { payload: { page: string; level: string } }
    ) => {
      state.level = payload.level;
      state.page = payload.page;
    },
    setGameStart: (state) => {
      state.isGameStarted = true;
    },
    setGameEnd: (state) => {
      state.isGameEnded = true;
      state.isGameStarted = false;
    },
    resetGame: (state) => {
      return {
        ...initialState,
        level: state.level,
        page: state.page,
        wordsData: shuffle([...state.gameData, ...state.wordsData]),
      };
    },
    gameStep: (state) => {
      const { wordsData, gameData } = state;
      if (wordsData.length === 0) {
        state.isGameEnded = true;
      } else {
        const randWordData1 = wordsData.pop();
        const randWordData2 =
          wordsData.length > 1
            ? wordsData.at(getRandNumber(wordsData.length - 1))
            : gameData.at(getRandNumber(gameData.length - 1));

        gameData.push(randWordData1);
        state.currentWord = {
          word: randWordData1.word,
          wordTranslate: [randWordData1, randWordData2][
            Math.round(Math.random())
          ].wordTranslate,
        };
      }
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
