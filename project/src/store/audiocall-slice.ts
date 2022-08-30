import { createSlice, current, PayloadAction } from "@reduxjs/toolkit";
import { Set } from "typescript";
import { IWord } from "../interfaces/word";

interface IAudioCallState {
  isGameStarted: boolean;
  dataBox: IWord[];
  gameBox: IWord[];
  playedBox: string[];
  currentWord: IWord | null;
  trueAnswer: IWord[];
  falseAnswer: IWord[];
  currentStep: number;
}

const initialState: IAudioCallState = {
  isGameStarted: false,
  dataBox: [],
  gameBox: [],
  playedBox: [],
  currentWord: null,
  trueAnswer: [],
  falseAnswer: [],
  currentStep: 0,
};
function excludeRepeat(first: string[], second: IWord[]): IWord {
  const current = second[Math.ceil(Math.random() * 19)];
  return !first.includes(current.id) ? current : excludeRepeat(first, second);
}

export const audioCallSlice = createSlice({
  initialState,
  name: "audiocall",
  reducers: {
    startGame(state, action: PayloadAction<Partial<IAudioCallState>>) {
      state.isGameStarted = true;
      state.dataBox = action.payload.dataBox;
      state.currentWord = action.payload.dataBox[Math.ceil(Math.random() * 19)];
      state.gameBox.push(state.currentWord);
      while (state.gameBox.length < 5) {
        const newWord = state.dataBox[Math.ceil(Math.random() * 19)];
        if (!state.gameBox.includes(newWord)) state.gameBox.push(newWord);
      }
      state.gameBox.sort(() => Math.random() - 0.5);
      state.playedBox.push(state.currentWord.id);
    },
    gameStep(state, action: PayloadAction<Partial<IAudioCallState>>) {
      state.isGameStarted = false;

      state.currentStep++;

      state.dataBox = action.payload.dataBox;
      state.gameBox = [];

      state.currentWord = excludeRepeat(state.playedBox, state.dataBox);
      state.gameBox.push(state.currentWord);
      while (state.gameBox.length < 5) {
        const newWord = state.dataBox[Math.ceil(Math.random() * 19)];
        if (!state.gameBox.includes(newWord)) state.gameBox.push(newWord);
      }
      state.gameBox.sort(() => Math.random() - 0.5);
      state.playedBox.push(state.currentWord.id);
      state.trueAnswer = action.payload.trueAnswer;
      state.falseAnswer = action.payload.falseAnswer;

      state.isGameStarted = true;
    },
    endGame(state) {
      state.isGameStarted = false;
    },
    resetGame(state) {
      return initialState;
    },
  },
});

export default audioCallSlice.reducer;

export const { startGame, gameStep, endGame, resetGame } =
  audioCallSlice.actions;
