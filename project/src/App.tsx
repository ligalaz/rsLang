import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { BrowserRouter, Route, Navigate, Routes } from "react-router-dom";
import "./App.css";
import { IAuth } from "./interfaces/auth";
import LoginPage from "./pages/auth/login/login";
import RegistrationPage from "./pages/auth/registration/registration";
import { authService } from "./services/auth-service";
import { AppDispatch, RootState, useAppSelector } from "./store/store";

function App() {
  const dispatch: AppDispatch = useDispatch();

  const auth: IAuth = useAppSelector(
    (state: RootState) => state.authState.auth
  );
  useEffect(() => {
    if (auth) {
      dispatch(authService.endpoints.token.initiate(auth.userId));
    }
  }, []);

  return (
    <BrowserRouter>
      <div>
        <Routes>
          <Route
            path="/registration"
            element={
              !auth ? <RegistrationPage /> : <Navigate to="/main" replace />
            }
          />
          <Route
            path="/login"
            element={!auth ? <LoginPage /> : <Navigate to="/main" replace />}
          />
          <Route path="*" element={<Navigate to="/registration" />} />
          <Route path="/main" element={<div>main</div>} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
