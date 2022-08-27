import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { startGame } from "../../../store/sprint-slice";
import { useGetWordsQuery } from "../../../services/words-service";
import { TUTORIAL_SECTION_COUNT } from "../../../config";

const GameInitialPage = () => {
  let count = TUTORIAL_SECTION_COUNT;

  const [select, setSelect] = useState("1");
  const { data, isLoading } = useGetWordsQuery({ group: Number(select) - 1 });

  const dispatch = useDispatch();

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
      <button onClick={() => dispatch(startGame())}>Start Game</button>
    </>
  );
};

export default GameInitialPage;
