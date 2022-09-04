import React from "react";
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

  const { resetGame, restartGame, gameStep, settingsDown } = useActions();

  const results = [
    {
      answers: trueAnswers,
      header: "I know :)",
      titleClassName: "results-popup__title title--true",
      titleChildClassName: "answers__count--true",
    },
    {
      answers: falseAnswers,
      header: "I don't know :(",
      titleClassName: "results-popup__title title--false",
      titleChildClassName: "answers__count--false",
    },
  ];

  return (
    <div className="overlay">
      <div className="results">
        <CloseBtn className="results__circle" />
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
              await restartGame();
              gameStep();
            }}
            className="btn btn--color_red"
          >
            Restart
          </button>
          <button
            onClick={async () => {
              await resetGame();
              settingsDown();
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
