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
import AudioCallPage from "./pages/games/audiocall/audiocall-game-page/audiocall";
import SprintGamePage from "./pages/games/sprint/sprint-game-page/sprint-game-page";
import Personal from "./pages/main/components/personal/personal";
import { useMediaQuery } from "usehooks-ts";
import SavannaGame from "./pages/games/savanna/savanna-game";
import "./App.scss";
import ChartControl from "./pages/main/components/charts/chart-control";
import Promo from "./pages/main/components/promo/promo";
import GameResultPage from "./pages/games/audiocall/game-result-page/audiocall-result";

function App() {
  const dispatch: AppDispatch = useDispatch();
  const isTablet = useMediaQuery("(max-width: 767px)");
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

          <Route path="audiocall" element={<AudioCallPage />} />
          <Route path="sprint" element={<SprintGamePage />} />
          <Route path="savanna" element={<SavannaGame />} />
          <Route path="overlay" element={<GameResultPage />} />
          <Route path="main/*" element={<MainPage />}>
            <Route index element={<Home />} />
            <Route
              path="personal"
              element={
                isTablet ? <Personal /> : <Navigate to="/main" replace />
              }
            />
            <Route path="textbook/:group/:page" element={<Textbook />} />
            <Route path="promo" element={<Promo />} />
            <Route path="about-us" element={<AboutUs />} />
            <Route
              path="statistics"
              element={
                auth ? <ChartControl /> : <Navigate to="/main" replace />
              }
            />
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
