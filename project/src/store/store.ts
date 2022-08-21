import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { wordsService } from "../services/words-service";
import { authService } from "../services/auth-service";
import { userWordsService } from "../services/user-words-service";
import authReducer from "./auth-slice";
import { TypedUseSelectorHook, useSelector } from "react-redux";

export const rootReducer = combineReducers({
  [wordsService.reducerPath]: wordsService.reducer,
  [authService.reducerPath]: authService.reducer,
  [userWordsService.reducerPath]: userWordsService.reducer,
  authState: authReducer,
});
export const setupStore = () => {
  return configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(
        wordsService.middleware,
        authService.middleware,
        userWordsService.middleware
      ),
  });
};

export type RootState = ReturnType<typeof rootReducer>;
export type AppStore = ReturnType<typeof setupStore>;
export type AppDispatch = AppStore["dispatch"];
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
