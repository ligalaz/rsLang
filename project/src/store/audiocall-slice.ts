import { createSlice } from "@reduxjs/toolkit";
import { Set } from "typescript";
import { store } from "..";
import { IWord } from "../interfaces/word";

interface IAudioCallState {
  isGameStarted: boolean;
  dataBox: IWord[];
  gameBox: Set<string>;
  playedBox: IWord[];
  currentWord: IWord | null;
  trueAnswer: IWord[];
  falseAnswer: IWord[];
}

const initialState: IAudioCallState = {
  isGameStarted: false,
  dataBox: [],
  gameBox: new Set(""),
  playedBox: [],
  currentWord: null,
  trueAnswer: [],
  falseAnswer: [],
};

export const audiCallSlice = createSlice({
  initialState,
  name: "audiocall",
  reducers: {
    startGame(state, { payload }) {
      state.isGameStarted = true;
      state.dataBox = payload.data;
    },
  },
});

export default audiCallSlice.reducer;

//export const {} = audiCallSlice.actions;
