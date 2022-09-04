import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { BrowserRouter, Route, Navigate, Routes } from "react-router-dom";
import { IAuth } from "./interfaces/auth";
import LoginPage from "./pages/auth/login/login";
import RegistrationPage from "./pages/auth/registration/registration";
import MainPage from "./pages/main/main";
import Textbook from "./pages/main/components/textbook/textbook";
import AboutUs from "./pages/main/components/about-us/about-us";
import Home from "./pages/main/components/home/home";
import { authService } from "./services/auth-service";
import { AppDispatch, RootState, useAppSelector } from "./store/store";
import { ToastContainer } from "react-toastify";
import "./App.scss";

import AudioCallPage from "./pages/games/audiocall/audiocall-game-page/audiocall";
import SprintGamePage from "./pages/games/sprint/sprint-game-page/sprint-game-page";

function App() {
  const dispatch: AppDispatch = useDispatch();

  const auth: IAuth = useAppSelector(
    (state: RootState) => state.authState.auth
  ) as IAuth;
  useEffect(() => {
    if (auth) {
      dispatch(authService.endpoints.token.initiate(auth.userId));
    }
  }, []);

  return (
    <BrowserRouter>
      <div className="app">
        <Routes>
          <Route
            path="registration"
            element={
              !auth ? <RegistrationPage /> : <Navigate to="main" replace />
            }
          />
          <Route
            path="login"
            element={!auth ? <LoginPage /> : <Navigate to="main" replace />}
          />

          <Route path="main/audiocall" element={<AudioCallPage />} />
          <Route path="main/sprint" element={<SprintGamePage />} />
          <Route path="main/*" element={<MainPage />}>
            <Route index element={<Home />} />
            <Route path="textbook/:group/:page" element={<Textbook />} />
            <Route path="about-us" element={<AboutUs />} />
          </Route>
          <Route path="*" element={<Navigate to="main" />} />
        </Routes>
        <>
          <ToastContainer />
        </>
      </div>
    </BrowserRouter>
  );
}

export default App;
