import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../store/store";

interface SprintState {
  isGameStarted: boolean;
}

const initialState: SprintState = {
  isGameStarted: false,
};

export const sprintSlice = createSlice({
  name: "sprint",
  initialState,
  reducers: {
    startGame: (state) => {
      state.isGameStarted = true;
    },
  },
});

export const { startGame } = sprintSlice.actions;

export const selectIsGameStarted = (state: RootState) =>
  state.sprintState.isGameStarted;

export default sprintSlice.reducer;
