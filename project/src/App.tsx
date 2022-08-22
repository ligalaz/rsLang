import React, { useEffect, useState } from "react";
import { BrowserRouter, Route, Navigate, Routes } from "react-router-dom";
import "./App.css";
import LoginPage from "./pages/auth/login/login";
import RegistrationPage from "./pages/auth/registration/registration";
import { useGetWordsMutation } from "./services/words-service";

function App() {
  const [getWords, { data, isLoading }] = useGetWordsMutation();

  return (
    <BrowserRouter>
      <div>
        <div className="App">Hello React!</div>
        {isLoading ? null : (
          <button onClick={() => getWords({ group: 0, page: 0 })}>
            Получить все слова
          </button>
        )}

        {data ? data.map((word) => <div key={word.id}>{word.word}</div>) : null}
        <Routes>
          <Route path="/registration" element={<RegistrationPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
