import React from "react";
import { useActions } from "../../../../hooks/actions";
import { useAppSelector } from "../../../../store/store";
import ResultBlock from "../components/result-block/result-block";

const GameResultPage = () => {
  const { trueAnswers, falseAnswers, score } = useAppSelector(
    (state) => state.sprintState
  );
  const { resetGame, startGame } = useActions();

  const results = [
    {
      answers: Array.from(new Set(trueAnswers)),
      header: "Я знаю :)",
      classModifier: "true",
    },
    {
      answers: Array.from(new Set(falseAnswers)),
      header: "Я не знаю :(",
      classModifier: "false",
    },
  ];

  return (
    <div className="results-popup">
      <div className="results-popup__header">
        <h2 className="results-popup__title">Результаты</h2>
        <p>
          Вы набрали
          <span className="results-popup__score">{score}</span>
          очков
        </p>
      </div>
      {results.map((result) => (
        <ResultBlock key={result.header} result={result} />
      ))}
      <div className="btn-container">
        <button
          onClick={async () => {
            await resetGame();
            startGame();
          }}
          className="reset-btn"
        >
          Restart
        </button>
        <button className="btn">Statistic</button>
        <button onClick={() => resetGame()} className="btn">
          New Game
        </button>
      </div>
    </div>
  );
};

export default GameResultPage;

/* <section className="answers">
        <h3 className="answers__title">
          Я знаю
          <span className="answers__count answers__count--true">
            {uniqueTrueAnswers.length}
          </span>
          :)
        </h3>
        {uniqueTrueAnswers.map(({ id, word, wordTranslate }) => (
          <div className="answers__item" key={id}>
            <div>{word}</div>
            <div>{wordTranslate}</div>
          </div>
        ))}
      </section>
      <section className="answers">
        <h3 className="answers__title">
          Я не знаю
          <span className="answers__count answers__count--false">
            {uniqueFalseAnswers.length}
          </span>
          :(
        </h3>
        {uniqueFalseAnswers.map(({ id, word, wordTranslate }) => (
          <div className="answers__item" key={id}>
            <div>{word}</div>
            <div>{wordTranslate}</div>
          </div>
        ))}
      </section> */
