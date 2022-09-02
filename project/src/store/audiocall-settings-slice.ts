import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface IAudioCallSettings {
  group?: number;
  page?: number;
  maxGroup?: number;
  maxPage?: number;
  allGameWords?: number;
  allPlayWords?: number;
  isAnswer?: boolean;
  trueRow?: number;
}

const initialState: IAudioCallSettings = {
  group: 0,
  page: 0,
  maxGroup: 6,
  maxPage: 30,
  allGameWords: 10,
  allPlayWords: 5,
  isAnswer: false,
  trueRow: 0,
};

export const audioCallSettingsSlice = createSlice({
  initialState,
  name: "audiCallSettings",
  reducers: {
    settingsUp(state, action: PayloadAction<IAudioCallSettings>) {
      state.group = action.payload.group;
      state.page = action.payload.page;
    },
    changeAnswer(state, action: PayloadAction<IAudioCallSettings>) {
      state.isAnswer = action.payload.isAnswer;
    },
    setTrueRaw(state, action: PayloadAction<IAudioCallSettings>) {
      if (state.trueRow < action.payload.trueRow) {
        state.trueRow = action.payload.trueRow;
        localStorage.setItem("trueRow", String(state.trueRow));
      }
    },
    settingsDown(state) {
      return initialState;
    },
  },
});

export default audioCallSettingsSlice.reducer;
export const { settingsUp, settingsDown, changeAnswer, setTrueRaw } =
  audioCallSettingsSlice.actions;
