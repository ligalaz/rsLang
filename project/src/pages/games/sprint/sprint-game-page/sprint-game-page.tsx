import React, { useEffect, useState } from "react";
import { useAppSelector } from "../../../../store/store";
import { useActions } from "../../../../hooks/actions";
import { useGetWordsQuery } from "../../../../services/words-service";
import Timer from "../components/timer/timer";
import tick from "../../../../assets/sound/tick.mp3";
import cross from "../../../../assets/sound/cross.mp3";
import "../../../main/components/games-promo/game-card/sprint-card/sprint-card.scss";
import SelectionOfParameters from "../components/selection-of-parameters/selection-of-parameters";
import { SELECTION_DATA } from "../../../../config";
import CloseBtn from "../components/close-btn/close-btn";
import AudioBtn from "../components/audio/audio-btn";
import ProgressLabels from "../components/progress-labels/progress-labels";
import GameResultPage from "../game-result-page/game-result-page";
import "./sprint-game-page.scss";

const timerDetails = {
  delay: 1000,
  initial: 2,
  className: "sprint-timer sprint-game__sprint-timer",
};

const SprintGamePage = (): JSX.Element => {
  const audio = new Audio();
  const { gameStep, changeGameScore, getData, setLevel, setGameState } =
    useActions();
  const {
    gameData,
    score,
    level,
    isResultsShown,
    currentWord,
    trueAnswersCount,
    isGameStarted,
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
            <CloseBtn isDisabled={!isGameStarted} />
          </header>
          <main className="main">
            <section className="sprint-game">
              <div className="sprint-game__header">
                <span className="sprint-game__score">{score}</span>
                <ProgressLabels />
              </div>
              <div className="sprint-game__selects">
                {SELECTION_DATA.map((selection) => {
                  return (
                    <SelectionOfParameters
                      key={selection.label}
                      selectionDetails={selection}
                      isDisabled={true}
                      value={selection.label === "level" ? level : level}
                      setValue={selection.label === "level" && setLevel}
                    />
                  );
                })}
                <AudioBtn
                  className={`sprint-game__audio ${
                    !sound && "circle__audio--inactive"
                  }`}
                  isDisabled={!isGameStarted}
                  setSound={() => !isGameStarted && setSound(!sound)}
                />
              </div>
              <Timer
                timerDetails={timerDetails}
                endTimer={() => setGameState()}
              />
              <div className="sprint-game__text">
                {currentWord.wordTranslate}
                <span className="sprint-game__text--english">
                  {currentWord.word}
                </span>
              </div>
              <div className="sprint-game__btn-container">
                <button
                  disabled={!isGameStarted}
                  onClick={() => handleGameStep(false)}
                  className={`sprint-game__btn sprint-game__btn--no ${
                    !isGameStarted && "sprint-game__btn--disabled"
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
                  disabled={!isGameStarted}
                  onClick={() => handleGameStep(true)}
                  className={`sprint-game__btn sprint-game__btn--yes ${
                    !isGameStarted && "sprint-game__btn--disabled"
                  }`}
                >
                  верно
                </button>
              </div>
            </section>
          </main>
        </>
      )}
      {!isGameStarted && <GameResultPage />}
    </div>
  );
};

export default SprintGamePage;
