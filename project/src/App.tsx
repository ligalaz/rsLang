import React, { useEffect, useState } from "react";
import { BrowserRouter, Route, Navigate, Routes } from "react-router-dom";
import "./App.css";
import LoginPage from "./pages/auth/login/login";
import RegistrationPage from "./pages/auth/registration/registration";
import { useGetWordsQuery } from "./services/words-service";

function App() {
  const [page, setPage] = useState<number[]>([0, 0]);
  const { data, isFetching } = useGetWordsQuery(page);

  // useEffect(() => {
  //   console.log(data);
  // }, [data]);

  const nextPage: VoidFunction = () => {
    setPage(([group, page]: number[]) => [group, page + 1]);
  };

  return (
    <BrowserRouter>
      <div>
        {isFetching ? (
          <div>isLoading...</div>
        ) : (
          // <div onClick={nextPage} className="App">
          <div className="App">Hello React!</div>
        )}
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
