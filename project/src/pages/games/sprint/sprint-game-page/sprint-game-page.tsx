import React, { useEffect, useState } from "react";
import { useAppSelector } from "../../../../store/store";
import { useActions } from "../../../../hooks/actions";
import { useGetWordsQuery } from "../../../../services/words-service";
import Timer from "../components/timer/timer";
import tick from "../../../../assets/sound/tick.mp3";
import cross from "../../../../assets/sound/cross.mp3";
import "../../../main/components/games-promo/game-card/sprint-card/sprint-card.scss";
import CloseBtn from "../components/close-btn/close-btn";
import AudioBtn from "../components/audio-btn/audio-btn";
import ProgressLabels from "../components/progress-labels/progress-labels";
import "./sprint-game-page.scss";

const timerDetails = {
  delay: 1000,
  initial: 60,
  className: "sprint-timer sprint-game__sprint-timer",
};

const SprintGamePage = (): JSX.Element => {
  const audio = new Audio();
  const { gameStep, changeGameScore, getData, showResults } = useActions();
  const {
    gameData,
    score,
    level,
    isResultsShown,
    currentWord,
    trueAnswersCount,
  } = useAppSelector((state) => state.sprintState);

  const { data, isLoading } = useGetWordsQuery({ group: Number(level) - 1 });
  const [currentStep, setCurrentStep] = useState(0);
  const [indicatorClassName, setIndicatorClassName] = useState("");

  const [sound, setSound] = useState(true);

  const handleGameStep = (isRightBtn: boolean) => {
    const isTrueAnswer = isRightBtn
      ? gameData.at(-1).wordTranslate === currentWord.wordTranslate
      : gameData.at(-1).wordTranslate !== currentWord.wordTranslate;
    setIndicatorClassName("");
    changeGameScore(isTrueAnswer);

    audio.src = isTrueAnswer ? tick : cross;
    audio.currentTime = 0;
    sound ? audio.play() : audio.pause();

    setCurrentStep(currentStep + 1);
    gameStep();
  };

  document.onkeydown = (event) => {
    if (!isResultsShown) {
      if (event.code === "ArrowRight") {
        handleGameStep(true);
      }
      if (event.code === "ArrowLeft") {
        handleGameStep(false);
      }
    }
  };

  useEffect(() => {
    if (!isLoading) {
      getData(data);
      gameStep();
    }
  }, [isLoading]);

  useEffect(() => {
    if (currentStep) {
      setIndicatorClassName(
        `${
          trueAnswersCount ? "circle__tick" : "circle__cross"
        } circle--animated`
      );
    }
  }, [currentStep]);

  return (
    <div className="container">
      {isLoading ? (
        <div>...Loading</div>
      ) : (
        <>
          <header className="header">
            <CloseBtn isDisabled={isResultsShown} />
          </header>
          <main className="main">
            <section className="sprint-game">
              <div className="sprint-game__header">
                <span className="sprint-game__score">{score}</span>
                <ProgressLabels />
              </div>
              <div className="sprint-game__selects">
                <label className="label">
                  level
                  <select
                    value={level}
                    className="select select--disabled"
                    disabled
                  >
                    <option>{level}</option>
                  </select>
                </label>
                <label className="label sprint-game__label">
                  page
                  <select
                    value={level}
                    className="select select--disabled"
                    disabled
                  >
                    <option>{level}</option>
                  </select>
                </label>
                <AudioBtn
                  className={!sound && "circle__audio--inactive"}
                  isDisabled={isResultsShown}
                  setSound={() => !isResultsShown && setSound(!sound)}
                />
              </div>
              <Timer
                timerDetails={timerDetails}
                endTimer={() => showResults()}
              />
              <div className="sprint-game__text">
                {currentWord.wordTranslate}
                <span className="sprint-game__text--english">
                  {currentWord.word}
                </span>
              </div>
              <div className="sprint-game__btn-container">
                <button
                  disabled={isResultsShown}
                  onClick={() => handleGameStep(false)}
                  className={`sprint-game__btn sprint-game__btn--no ${
                    isResultsShown && "sprint-game__btn--disabled"
                  }`}
                >
                  неверно
                </button>
                <div className="sprint-game__answer-indicator">
                  <div
                    className={`circle sprint-game__circle ${indicatorClassName}`}
                  />
                </div>
                <button
                  disabled={isResultsShown}
                  onClick={() => handleGameStep(true)}
                  className={`sprint-game__btn sprint-game__btn--yes ${
                    isResultsShown && "sprint-game__btn--disabled"
                  }`}
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
