import React from "react";

import { resetGame, restartGame } from "../../../../store/audiocall-slice";
import ResultBlock from "../components/result-block/result-block";
import Title from "../components/result-block/title/title";
import "./audiocall-result.scss";
import { AppDispatch } from "../../../../store/store";
import { useDispatch } from "react-redux";
import { settingsDown } from "../../../../store/audiocall-settings-slice";
import CloseBtnComponent from "../components/audiocall-close-btn/close-btn-component";

const GameResultPage = (): JSX.Element => {
  const dispatch: AppDispatch = useDispatch();

  const results = [
    {
      answers: JSON.parse(localStorage.getItem("trueAnswers")),
      header: "I know :)",
      titleClassName: "results-popup__title title--true",
      titleChildClassName: "answers__count--true",
    },
    {
      answers: JSON.parse(localStorage.getItem("falseAnswers")),
      header: "I don't know :(",
      titleClassName: "results-popup__title title--false",
      titleChildClassName: "answers__count--false",
    },
  ];

  return (
    <div className="overlay">
      <div className="results">
        <div className="results-popup">
          <CloseBtnComponent />
          <div className="results-popup__header">
            <Title className="results-popup__title">Results</Title>
          </div>
          <div
            className={`results-popup__list ${"results-popup__list--scrollable"}`}
          >
            {results.map((result) => (
              <ResultBlock
                key={result.header}
                answersClassName="results-popup__answers"
                result={result}
              />
            ))}
          </div>
        </div>
        <div className="btn-container">
          <button
            onClick={() => {
              dispatch(restartGame());
            }}
            className="btn btn--color_red"
          >
            Restart
          </button>
          <button
            onClick={() => {
              dispatch(resetGame());
              dispatch(settingsDown());
            }}
            className="btn"
          >
            New Game
          </button>
        </div>
      </div>
    </div>
  );
};

export default GameResultPage;
