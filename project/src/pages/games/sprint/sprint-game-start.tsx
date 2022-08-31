import React from "react";
import { useAppSelector } from "../../../store/store";
import SprintGamePage from "./sprint-game-page/sprint-game-page";
import GameInitialPage from "./game-initial-page/game-initial-page";
import GameResultPage from "./game-result-page/game-result-page";

const SprintGameStart = (): JSX.Element => {
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
