import React from "react";
import { useAppSelector } from "../../../store/store";
import SprintGamePage from "./components/sprint-game-page/sprint-game-page";
import GameInitialPage from "./components/game-initial-page/game-initial-page";
import GameResultPage from "./components/game-result/game-result-page";

const SprintGameStart = () => {
  const { isGameStarted, isResultsShown } = useAppSelector(
    (state) => state.sprintState
  );

  return (
    <>
      {isGameStarted ? <SprintGamePage /> : <GameInitialPage />}
      {isResultsShown && <GameResultPage />}
    </>
  );
};

export default SprintGameStart;
