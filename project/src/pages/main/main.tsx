import "./main.scss";
import React, { useEffect, useState } from "react";
import Sidebar from "./components/sidebar/sidebar";
import Greetings from "./components/greetings/gretings";
import Personal from "./components/personal/personal";
import { RootState, useAppSelector } from "../../store/store";
import { useGetWordsQuery } from "../../services/words-service";
import { GetWordsRequest, IWord } from "../../interfaces/word";
import { Outlet } from "react-router";

const MainPage = () => {
  return (
    <div className="main">
      <Sidebar />
      <div className="main__middle">
        <Greetings />
        <Outlet />
      </div>
      <Personal />
    </div>
  );
};

export default MainPage;
