import React, { useState } from "react";
import { useActions } from "../../../../../hooks/actions";
import { TUTORIAL_SECTION_COUNT } from "../../../../../config";
import { useAppSelector } from "../../../../../store/store";

const GameInitialPage = () => {
  let count = TUTORIAL_SECTION_COUNT;

  const { level } = useAppSelector((state) => state.sprintState);
  const { startGame, setLevel } = useActions();

  return (
    <>
      <h1>SPRINT: Let’s catch!</h1>
      <label>
        Level
        <select
          value={level}
          className="level__list"
          onChange={(event) => setLevel(event.target.value)}
        >
          {[...new Array(TUTORIAL_SECTION_COUNT)]
            .map(() => (
              <option key={count--} className="level__item">
                {count}
              </option>
            ))
            .reverse()}
        </select>
      </label>
      <button
        onClick={() => {
          startGame();
        }}
      >
        Start Game
      </button>
    </>
  );
};

export default GameInitialPage;
