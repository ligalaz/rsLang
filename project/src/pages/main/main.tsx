import "./main.scss";
import React, { useEffect, useState } from "react";
import Sidebar from "./components/sidebar/sidebar";
import Greetings from "./components/greetings/gretings";
import Personal from "./components/personal/personal";
import { Outlet, useLocation } from "react-router";

const MainPage = () => {
  const location = useLocation();
  const [color, setColor] = useState(location.pathname.split("/")[3]);

  useEffect(() => {
    setColor(location.pathname.split("/")[3]);
  }, [location.pathname]);
  return (
    <div className="main-four">
      <Sidebar />
      <div className={`main-four__wrapper main-four__bg-filter-${color}`}>
        <div className="main-four__middle">
          <Greetings />
          <Outlet />
        </div>
      </div>
      <Personal />
    </div>
  );
};

export default MainPage;
