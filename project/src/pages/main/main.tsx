import "./main.scss";
import React from "react";
import Sidebar from "./components/sidebar/sidebar";
import Greetings from "./components/greetings/gretings";
import Personal from "./components/personal/personal";
import { RootState, useAppSelector } from "../../store/store";

const MainPage = () => {
  const userId: string = useAppSelector(
    (state: RootState) => state.authState.auth?.userId
  );

  console.log(userId);
  return (
    <div className="main">
      <Sidebar />
      <div className="main__middle">
        <Greetings />
      </div>
      <Personal />
    </div>
  );
};

export default MainPage;
