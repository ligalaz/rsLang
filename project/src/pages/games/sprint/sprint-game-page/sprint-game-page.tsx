import React, { useEffect, useState, useRef } from "react";
import { useAppSelector, RootState } from "../../../../store/store";
import { useActions } from "../../../../hooks/actions";
import Timer from "../components/timer/timer";
import tick from "../../../../assets/sound/tick.mp3";
import cross from "../../../../assets/sound/cross.mp3";
import "../../../main/components/games-promo/game-card/sprint-card/sprint-card.scss";
import CloseBtn from "../components/close-btn/close-btn";
import AudioBtn from "../components/audio/audio-btn";
import ProgressLabels from "../components/progress-labels/progress-labels";
import GameResultPage from "../game-result-page/game-result-page";
import { Word } from "../../../../interfaces/word";
import { IAuth } from "../../../../interfaces/auth";
import "./sprint-game-page.scss";
import SprintGameStartScreen from "../start-screen/sprint-game-start-screen";

const SprintGamePage = (): JSX.Element => {
  const audio = new Audio();

  const auth: IAuth = useAppSelector(
    (state: RootState) => state.authState?.auth
  );

  const { gameStep, changeGameScore, setGameEnd } = useActions();
  const {
    timer,
    delay,
    timerCircle,
    gameData,
    score,
    currentWord,
    trueAnswersCount,
    isGameStarted,
    isGameEnded,
  } = useAppSelector((state) => state.sprintState);

  const incorrectButtonRef = useRef(null);
  const correctButtonRef = useRef(null);
  const indicatorRef = useRef(null);

  const words: Word[] = useAppSelector(
    (state: RootState) => state.wordsState.words || []
  );

  const [currentStep, setCurrentStep] = useState(0);
  const [indicatorClassName, setIndicatorClassName] = useState("");

  const [sound, setSound] = useState(true);

  const handleGameState = (isRightBtn: boolean) => {
    const isTrueAnswer = isRightBtn
      ? gameData.at(-1).wordTranslate === currentWord.wordTranslate
      : gameData.at(-1).wordTranslate !== currentWord.wordTranslate;
    setIndicatorClassName("");
    changeGameScore(isTrueAnswer);

    audio.src = isTrueAnswer ? tick : cross;
    sound ? audio.play() : audio.pause();

    setCurrentStep(currentStep + 1);
  };

  useEffect(() => {
    if (currentStep) {
      setIndicatorClassName(
        `${
          trueAnswersCount ? "circle__tick" : "circle__cross"
        } circle--animated`
      );
    }
  }, [currentStep]);

  const handleKeyboardEvents = (event: KeyboardEvent) => {
    const { code, repeat } = event;

    if (!isGameEnded && !repeat) {
      if (code === "ArrowRight") {
        handleGameState(true);
      }
      if (code === "ArrowLeft") {
        handleGameState(false);
      }
    }
  };

  document.onkeydown = handleKeyboardEvents;

  const correctButton = correctButtonRef.current;
  const incorrectButton = incorrectButtonRef.current;
  const indicator = indicatorRef.current;

  const toggleButtonsState = () => {
    correctButton.disabled = !correctButton.disabled;
    incorrectButton.disabled = !incorrectButton.disabled;
    correctButton.classList.toggle("sprint-game__btn--disabled");
    incorrectButton.classList.toggle("sprint-game__btn--disabled");
  };

  useEffect(() => {
    isGameStarted && gameStep();
  }, [isGameStarted]);

  const handleAnimateStart = (event: AnimationEvent) => {
    if (event.animationName === "indicator" && !isGameEnded) {
      toggleButtonsState();
      document.onkeydown = null;
    }
  };

  const handleAnimateEnd = (event: AnimationEvent) => {
    if (event.animationName === "indicator") {
      if (isGameEnded) {
        indicator.removeEventListener(
          "animationstart",
          handleAnimateStart,
          false
        );
        indicator.removeEventListener("animationend", handleAnimateEnd, false);
      }
      gameStep();
      toggleButtonsState();
    }
  };

  useEffect(() => {
    if (indicator instanceof HTMLElement) {
      indicator.addEventListener("animationstart", handleAnimateStart, false);
      indicator.addEventListener("animationend", handleAnimateEnd, false);
    }
  }, [indicator, isGameEnded]);

  return (
    <>
      {!isGameStarted ? (
        <SprintGameStartScreen gameName="sprint" words={words} />
      ) : (
        <div className="container">
          <CloseBtn isDisabled={isGameEnded} />
          <main className="main">
            <section className="sprint-game">
              <div className="sprint-game__header">
                <span className="sprint-game__score">{score}</span>
                <ProgressLabels />
              </div>
              <div className="sprint-game__selects">
                <AudioBtn
                  className={`sprint-game__audio ${
                    !sound && "circle__audio--inactive"
                  }`}
                  isDisabled={isGameEnded}
                  setSound={() => !isGameEnded && setSound(!sound)}
                />
              </div>
              <Timer
                initial={timer}
                delay={delay}
                timerCircle={timerCircle}
                className="sprint-timer sprint-game__sprint-timer"
                endTimer={() => setGameEnd()}
              />
              <div className="sprint-game__text">
                {currentWord.wordTranslate}
                <span className="sprint-game__text--english">
                  {currentWord.word}
                </span>
              </div>
              <div className="sprint-game__btn-container">
                <button
                  onClick={() => handleGameState(false)}
                  disabled={isGameEnded}
                  className={`sprint-game__btn sprint-game__btn--no ${
                    isGameEnded && "sprint-game__btn--disabled"
                  }`}
                  ref={incorrectButtonRef}
                >
                  incorrect
                </button>
                <div className="sprint-game__answer-indicator">
                  <div
                    ref={indicatorRef}
                    className={`circle sprint-game__circle ${indicatorClassName}`}
                  />
                </div>
                <button
                  onClick={() => handleGameState(true)}
                  disabled={isGameEnded}
                  className={`sprint-game__btn sprint-game__btn--yes ${
                    isGameEnded && "sprint-game__btn--disabled"
                  }`}
                  ref={correctButtonRef}
                >
                  correct
                </button>
              </div>
            </section>
          </main>
          {isGameEnded && <GameResultPage />}
        </div>
      )}
    </>
  );
};

export default SprintGamePage;
