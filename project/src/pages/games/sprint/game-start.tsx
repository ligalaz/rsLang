import React from "react";
import { selectIsGameStarted } from "../../../store/sprint-slice";
import { useSelector } from "react-redux";
import SprintGame from "./sprint-game";
import GameInitialPage from "./game-initial-page";

const GameStart = () => {
  const isGameStarted = useSelector(selectIsGameStarted);

  return <>{isGameStarted ? <SprintGame /> : <GameInitialPage />}</>;
};

export default GameStart;
