import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface SprintSettings {
  group?: number;
  page?: number;
  maxGroup?: number;
  maxPage?: number;
  allGameWords?: number;
  allPlayWords?: number;
  isAnswer?: boolean;
  trueRow?: number;
  isTimerStart?: boolean;
}

const initialState: SprintSettings = {
  group: 0,
  page: 0,
  maxGroup: 6,
  maxPage: 30,
  isTimerStart: false,
};

export const sprintSettingsSlice = createSlice({
  initialState,
  name: "sprintGameSettings",
  reducers: {
    settingsUp(state, { payload }: { payload: SprintSettings }) {
      state.group = payload.group;
      state.page = payload.page;
    },
    timerUp(state) {
      state.isTimerStart = true;
    },
    settingsDown(state) {
      return initialState;
    },
  },
});

export const sprintSettingsActions = sprintSettingsSlice.actions;

export default sprintSettingsSlice.reducer;
