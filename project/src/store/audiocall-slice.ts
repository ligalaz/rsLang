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
  currentStep: 1,
};

export const audioCallSlice = createSlice({
  initialState,
  name: "audiocall",
  reducers: {
    startGame(state, action: PayloadAction<Partial<IAudioCallState>>) {
      state.isGameStarted = true;
      state.dataBox = action.payload.dataBox;
      state.currentWord = action.payload.dataBox[Math.ceil(Math.random() * 10)];
      state.gameBox.push(state.currentWord);
      while (state.gameBox.length < 5) {
        const newWord = state.dataBox[Math.ceil(Math.random() * 10)];
        if (!state.gameBox.includes(newWord)) state.gameBox.push(newWord);
      }
      state.gameBox.sort(() => Math.random() - 0.5);
      state.playedBox.push(state.currentWord.id);
      console.log("curr", state.gameBox);
    },
    gameStep(state, action: PayloadAction<Partial<IAudioCallState>>) {
      state.isGameStarted = false;
      state.currentStep++;
      state.dataBox = action.payload.dataBox;
      state.gameBox = [];
      console.log(state.playedBox.includes(state.currentWord.id));
      state.currentWord = action.payload.dataBox[Math.ceil(Math.random() * 10)];
      state.gameBox.push(state.currentWord);
      while (state.gameBox.length < 5) {
        const newWord = state.dataBox[Math.ceil(Math.random() * 10)];
        if (!state.gameBox.includes(newWord)) state.gameBox.push(newWord);
      }
      state.isGameStarted = true;
    },
    resetGame(state) {
      return initialState;
    },
  },
});

export default audioCallSlice.reducer;

export const { startGame, gameStep, resetGame } = audioCallSlice.actions;
