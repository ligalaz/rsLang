import React, { useEffect, useState } from "react";
import { useAppSelector } from "../../../../store/store";
import { useActions } from "../../../../hooks/actions";
import { useGetWordsQuery } from "../../../../services/words-service";
import Timer from "../components/timer/timer";

const timerDetails = {
  delay: 1000,
  initial: 60,
  className: "sprint-timer",
};

const SprintGamePage = () => {
  const { gameStep, changeGameScore, getData } = useActions();
  const { gameData, score, level, isResultsShown, currentWord } =
    useAppSelector((state) => state.sprintState);

  const { data, isLoading } = useGetWordsQuery({ group: Number(level) - 1 });

  const checkFalseAnswer = () => {
    const isTrue = gameData.at(-1).wordTranslate !== currentWord.wordTranslate;
    changeGameScore(isTrue);
    gameStep();
  };

  const checkTrueAnswer = () => {
    const isTrue = gameData.at(-1).wordTranslate === currentWord.wordTranslate;
    changeGameScore(isTrue);
    gameStep();
  };

  document.onkeydown = (event) => {
    if (!isResultsShown) {
      if (event.code === "ArrowRight") {
        checkTrueAnswer();
      }
      if (event.code === "ArrowLeft") {
        checkFalseAnswer();
      }
    }
  };

  useEffect(() => {
    if (!isLoading) {
      getData(data);
      gameStep();
    }
  }, [isLoading]);

  return (
    <div className="container">
      {isLoading ? (
        <div>...Loading</div>
      ) : (
        <>
          <header className="header">
            <div className="close-btn"></div>
          </header>
          <main className="main">
            <section className="sprint-game">
              <div className="sprint-game__header">
                <span className="score">{score}</span>
                <div></div>
              </div>
              <Timer timerDetails={timerDetails} />
              <div className="sprint-game__word">
                {currentWord.word}
                <span className="sprint-game__word-translation">
                  {currentWord.wordTranslate}
                </span>
              </div>
              <div>
                <button
                  disabled={isResultsShown && true}
                  onClick={() => checkFalseAnswer()}
                  className="sprint-game__no-btn"
                >
                  неверно
                </button>
                <button
                  disabled={isResultsShown && true}
                  onClick={() => checkTrueAnswer()}
                  className="sprint-game__yes-btn"
                >
                  верно
                </button>
              </div>
            </section>
          </main>
        </>
      )}
    </div>
  );
};

export default SprintGamePage;
