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
  // const [params, setParams] = useState<GetWordsRequest>({
  //   group: 0,
  //   page: Math.round(Math.random() * 20),
  // });
  // const {
  //   data: words = [],
  //   isLoading,
  //   isFetching: isWordsFetching,
  // } = useGetWordsQuery(params);
  // const [randomWords, setRandomWords] = useState<IWord[]>([]);

  // useEffect(() => {
  //   if (!isLoading && randomWords.length < 60) {
  //     setParams((prev: GetWordsRequest) => ({
  //       ...prev,
  //       page: Math.round(Math.random() * 20),
  //     }));
  //   }
  // }, [words]);

  // useEffect(() => {
  //   setRandomWords((prev: IWord[]) => [...prev, ...words]);
  // }, [words]);

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
