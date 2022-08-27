import React, { useState, useEffect } from "react";
import { useGetWordsQuery } from "../../../services/words-service";
import { TUTORIAL_SECTION_COUNT } from "../../../config";

const GameStartPage = () => {
  let count = TUTORIAL_SECTION_COUNT;

  const [select, setSelect] = useState("1");
  const [isStarted, setIsStarted] = useState(false);
  const { data, isLoading } = useGetWordsQuery({ group: Number(select) - 1 });

  return (
    <>
      <h1>SPRINT: Let’s catch!</h1>
      <label>
        Level
        <select
          value={select}
          className="level__list"
          onChange={(event) => setSelect(event.target.value)}
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
          setIsStarted(true);
        }}
      >
        Start Game
      </button>
    </>
  );
};

export default GameStartPage;
