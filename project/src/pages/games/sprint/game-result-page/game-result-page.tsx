import React, { useState } from "react";
import { useActions } from "../../../../hooks/actions";
import { useAppSelector } from "../../../../store/store";
import ResultBlock from "../components/result-block/result-block";
import Title from "../components/title/title";
import CloseBtn from "../components/close-btn/close-btn";
import "./game-result-page.scss";

const GameResultPage = (): JSX.Element => {
  const { trueAnswers, falseAnswers, score } = useAppSelector(
    (state) => state.sprintState
  );
  const { resetGame, setGameState } = useActions();
  const [className, setClassName] = useState("");

  const results = [
    {
      answers: Array.from(new Set(trueAnswers)),
      header: "I know :)",
      titleClassName: "results-popup__title title--true",
      titleChildClassName: "answers__count--true",
    },
    {
      answers: Array.from(new Set(falseAnswers)),
      header: "I don't know :(",
      titleClassName: "results-popup__title title--false",
      titleChildClassName: "answers__count--false",
    },
  ];

  return (
    <div className={`overlay ${className}`}>
      <div className="results">
        <CloseBtn
          className="results__circle"
          close={() => {
            setClassName("overlay--close-animated");
          }}
        />
        <div className="results-popup">
          <div className="results-popup__header">
            <Title className="results-popup__title">Results</Title>
            <div>
              Your score is
              <span className="results-popup__score">{score}</span>
            </div>
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
            onClick={async () => {
              resetGame();
            }}
            className="btn btn--color_red"
          >
            Restart
          </button>
          <button className="btn">Statistic</button>
          <button onClick={() => resetGame()} className="btn">
            New Game
          </button>
        </div>
      </div>
    </div>
  );
};

export default GameResultPage;
