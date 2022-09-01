import React, { useState } from "react";
import { useActions } from "../../../../hooks/actions";
import { useAppSelector } from "../../../../store/store";

const GameInitialPage = (): JSX.Element => {
  const { level } = useAppSelector((state) => state.sprintState);
  const { setGameState, setLevel } = useActions();

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
          {[...new Array(6)]
            .map((_, index) => (
              <option key={index} className="level__item">
                {index}
              </option>
            ))
            .reverse()}
        </select>
      </label>
      <button
        onClick={() => {
          setGameState();
        }}
      >
        Start Game
      </button>
    </>
  );
};

export default GameInitialPage;
