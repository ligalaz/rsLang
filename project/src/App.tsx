import React, { useEffect, useState } from "react";
import { BrowserRouter, Route, Navigate, Routes } from "react-router-dom";
import LoginPage from "./pages/auth/login/login";
import RegistrationPage from "./pages/auth/registration/registration";
import MainPage from "./pages/main/main";
import { useGetWordsMutation } from "./services/words-service";
import "./App.scss";

function App() {
  const [getWords, { data, isLoading }] = useGetWordsMutation();

  return (
    <BrowserRouter>
      <div className="app">
        {data ? data.map((word) => <div key={word.id}>{word.word}</div>) : null}
        <Routes>
          <Route path="/registration" element={<RegistrationPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/main" element={<MainPage />} />
          <Route path="*" element={<Navigate to="/main" />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
