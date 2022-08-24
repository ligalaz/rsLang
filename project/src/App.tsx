import React from "react";
import { BrowserRouter, Route, Navigate, Routes } from "react-router-dom";
import LoginPage from "./pages/auth/login/login";
import RegistrationPage from "./pages/auth/registration/registration";
import MainPage from "./pages/main/main";
import Textbook from "./pages/main/components/textbook/textbook";
import AboutUs from "./pages/main/components/about-us/about-us";
import Home from "./pages/main/components/home/home";
import Promo from "./pages/main/components/promo/promo";
import "./App.scss";

function App() {
  return (
    <BrowserRouter>
      <div className="app">
        <Routes>
          <Route path="registration" element={<RegistrationPage />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="main/*" element={<MainPage />}>
            <Route index element={<Home />} />
            <Route path="promo" element={<Promo />} />
            <Route path="textbook" element={<Textbook />} />
            {/* <Route path="textbook/:group/:page" element={<Textbook />} /> */}
            <Route path="about-us" element={<AboutUs />} />
          </Route>
          <Route path="*" element={<Navigate to="main" />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
