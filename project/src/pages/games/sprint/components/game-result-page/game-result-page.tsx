import React from "react";
import { useActions } from "../../../../../hooks/actions";
import { useAppSelector } from "../../../../../store/store";

const GameResultPage = () => {
  const { trueAnswers, falseAnswers, score } = useAppSelector(
    (state) => state.sprintState
  );
  const { resetGame, startGame } = useActions();

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
      <section className="answers">
        <h3 className="answers__title">
          Я знаю
          <span className="answers__count answers__count--true">
            {trueAnswers.length}
          </span>
          :)
        </h3>
        {trueAnswers.map((trueAnswer, index) => (
          <div className="answers__item" key={index}>
            {trueAnswer.word}
          </div>
        ))}
      </section>
      <section className="answers">
        <h3 className="answers__title">
          Я не знаю
          <span className="answers__count answers__count--false">
            {falseAnswers.length}
          </span>
          :(
        </h3>
        {falseAnswers.map((falseAnswer, index) => (
          <div className="answers__item" key={index}>
            {falseAnswer.word}
          </div>
        ))}
      </section>
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
