import "./main.scss";
import React from "react";
import Sidebar from "./components/sidebar/sidebar";
import Greetings from "./components/greetings/gretings";
import Personal from "./components/personal/personal";
import { Outlet } from "react-router";

const MainPage = () => {
  return (
    <div className="main">
      <Sidebar />
      <div className="main__wrapper">
        <div className="main__middle">
          <Greetings />
          <Outlet />
        </div>
      </div>
      <Personal />
    </div>
  );
};

export default MainPage;
