import React from "react";
import CloseBtn from "../../../../../components/close-btn/close-btn";
import ResultBlock from "../../../sprint/components/result-block/result-block";
import Title from "../../../sprint/components/title/title";
import { GameResult } from "../../savanna-game";
import "./savanna-result.scss";

interface SavannaResultProps {
  result: GameResult;
  onRestart: VoidFunction;
  onNewGame: VoidFunction;
}

const SavannaResult = ({
  result,
  onRestart,
  onNewGame,
}: SavannaResultProps): JSX.Element => {
  const results = [
    {
      answers: result.true || [],
      header: "I know :)",
      titleClassName: "results-popup__title title--true",
      titleChildClassName: "answers__count--true",
    },
    {
      answers: result.false || [],
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
          <button onClick={onRestart} className="btn btn--color_red">
            Restart
          </button>
          <button onClick={onNewGame} className="btn">
            New Game
          </button>
        </div>
      </div>
    </div>
  );
};

export default SavannaResult;
