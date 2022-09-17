import { createSlice, current, PayloadAction } from "@reduxjs/toolkit";
import { IWord } from "../interfaces/word";

interface IAudioCallState {
  isGameStarted: boolean;
  isGameEnded: boolean;
  dataBox: IWord[];
  gameBox: IWord[];
  playedBox: string[];
  currentWord: IWord | null;
  trueAnswer: IWord[];
  falseAnswer: IWord[];
  currentStep: number;
}

const initialState: IAudioCallState = {
  isGameEnded: false,
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
function createGameRow(
  _gameBox: IWord[],
  _currentWord: IWord,
  _dataBox: IWord[],
  _playedBox: string[]
): void {
  _gameBox.push(_currentWord);
  while (_gameBox.length < 5) {
    const newWord = _dataBox[Math.ceil(Math.random() * 19)];
    if (!_gameBox.includes(newWord)) _gameBox.push(newWord);
  }
  _gameBox.sort(() => Math.random() - 0.5);
  _playedBox.push(_currentWord.id);
}

export const audioCallSlice = createSlice({
  initialState,
  name: "audiocall",
  reducers: {
    startGame(state, action: PayloadAction<Partial<IAudioCallState>>) {
      state.isGameStarted = true;
      state.dataBox = action.payload.dataBox;
      state.currentWord = action.payload.dataBox[Math.ceil(Math.random() * 19)];
      createGameRow(
        state.gameBox,
        state.currentWord,
        state.dataBox,
        state.playedBox
      );
    },
    gameStep(state, action: PayloadAction<Partial<IAudioCallState>>) {
      state.isGameStarted = false;
      state.currentStep++;
      state.dataBox = action.payload.dataBox;
      state.currentWord = excludeRepeat(state.playedBox, state.dataBox);
      state.gameBox = [];
      createGameRow(
        state.gameBox,
        state.currentWord,
        state.dataBox,
        state.playedBox
      );

      state.trueAnswer = action.payload.trueAnswer;
      state.falseAnswer = action.payload.falseAnswer;

      state.isGameStarted = true;
    },
    endGame(state) {
      if (state.currentStep === 10) {
        localStorage.setItem("trueAnswers", JSON.stringify(state.trueAnswer));
        localStorage.setItem("falseAnswers", JSON.stringify(state.falseAnswer));
        state.isGameEnded = true;
      }
    },
    restartGame(state) {
      state.isGameEnded = false;
      state.isGameStarted = true;
      state.currentStep = 0;
      state.playedBox = [];
      state.currentWord = state.dataBox[Math.ceil(Math.random() * 19)];
      state.gameBox = [];
      createGameRow(
        state.gameBox,
        state.currentWord,
        state.dataBox,
        state.playedBox
      );
    },
    resetGame(state) {
      state.isGameEnded = false;
      state.isGameStarted = false;
      state.dataBox = [];
      state.gameBox = [];
      state.playedBox = [];
      state.currentWord = null;
      state.trueAnswer = [];
      state.falseAnswer = [];
      state.currentStep = 0;
    },
  },
});

export default audioCallSlice.reducer;

export const { startGame, gameStep, endGame, resetGame, restartGame } =
  audioCallSlice.actions;
