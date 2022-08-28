import React from "react";
import { useAppSelector } from "../../../store/store";
import SprintGame from "./components/sprint-game/sprint-game";
import GameInitialPage from "./components/game-initial-page/game-initial-page";

const SprintGameStart = () => {
  const { isGameStarted } = useAppSelector((state) => state.sprintState);

  return <>{isGameStarted ? <SprintGame /> : <GameInitialPage />}</>;
};

export default SprintGameStart;
