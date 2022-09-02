import React, { useEffect, useState } from "react";
import { useAppSelector, RootState } from "../../../../store/store";
import { useActions } from "../../../../hooks/actions";
import { useGetWordsMutation } from "../../../../services/words-service";
import { useGetUserWordsMutation } from "../../../../services/aggregated-words-service";
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
import { Word } from "../../../../interfaces/word";
import { IAuth } from "../../../../interfaces/auth";
import "./sprint-game-page.scss";

const timerDetails = {
  delay: 1000,
  initial: 60,
  className: "sprint-timer sprint-game__sprint-timer",
};

const SprintGamePage = (): JSX.Element => {
  const audio = new Audio();

  const auth: IAuth = useAppSelector(
    (state: RootState) => state.authState?.auth
  );

  const {
    gameStep,
    changeGameScore,
    getData,
    setLevel,
    setGameStart,
    setGameEnd,
  } = useActions();
  const {
    gameData,
    score,
    level,
    currentWord,
    trueAnswersCount,
    isGameStarted,
    isGameEnded,
  } = useAppSelector((state) => state.sprintState);

  const [getWords, { isLoading, isSuccess }] = useGetWordsMutation();
  const [
    getAggregatedWords,
    {
      isLoading: isAggregatedWordsLoading,
      isSuccess: isAggregatedWordsSuccess,
    },
  ] = useGetUserWordsMutation();
  const words: Word[] = useAppSelector(
    (state: RootState) => state.wordsState.words || []
  );

  const isLoadingData = isLoading || isAggregatedWordsLoading;
  const isDisabledBtn = !isGameStarted || isGameEnded || isLoadingData;
  const isDisabledThroughoutGame = isGameStarted || isGameEnded;
  const isDisabledStartGame = isGameStarted && !isLoadingData;

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
    sound ? audio.play() : audio.pause();

    setCurrentStep(currentStep + 1);
    gameStep();
  };

  document.onkeydown = (event) => {
    if (isDisabledStartGame) {
      if (event.code === "ArrowRight") {
        handleGameStep(true);
      }
      if (event.code === "ArrowLeft") {
        handleGameStep(false);
      }
    }
  };

  useEffect(() => {
    if (isGameStarted) {
      if (auth?.userId) {
        getAggregatedWords({
          userId: auth.userId,
          params: {
            group: +level - 1,
            wordsPerPage: 20,
          },
        });
      } else {
        getWords({
          group: +level - 1,
        });
      }
    }
  }, [level, isGameStarted]);

  useEffect(() => {
    if (isSuccess || isAggregatedWordsSuccess) {
      getData(words);
      gameStep();
    }
  }, [isSuccess, isAggregatedWordsSuccess]);

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
      <header className="header">
        <button
          disabled={isDisabledThroughoutGame}
          className={`play-btn header__play-btn ${
            isDisabledThroughoutGame && "play-btn--disabled"
          }`}
          onClick={() => {
            setGameStart();
          }}
        >
          Play
        </button>
        <CloseBtn isDisabled={isGameEnded} />
      </header>
      <main className="main">
        <section className="sprint-game">
          <div className="sprint-game__header">
            <span className="sprint-game__score">{score}</span>
            <ProgressLabels />
          </div>
          <div className="sprint-game__selects">
            {SELECTION_DATA.slice(0, 1).map((selection) => {
              return (
                <SelectionOfParameters
                  key={selection.label}
                  selectionDetails={selection}
                  isDisabled={isDisabledThroughoutGame}
                  value={selection.label === "level" ? level : level}
                  setValue={selection.label === "level" && setLevel}
                />
              );
            })}
            <AudioBtn
              className={`sprint-game__audio ${
                !sound && "circle__audio--inactive"
              }`}
              isDisabled={isDisabledBtn}
              setSound={() => isDisabledStartGame && setSound(!sound)}
            />
          </div>
          {isDisabledThroughoutGame && (
            <Timer
              timerDetails={timerDetails}
              endTimer={() => setGameEnd()}
              isStarted={isDisabledStartGame}
            />
          )}
          {isLoadingData && <div>...Loading</div>}
          {!isLoadingData && isDisabledThroughoutGame && (
            <div className="sprint-game__text">
              {currentWord.wordTranslate}
              <span className="sprint-game__text--english">
                {currentWord.word}
              </span>
            </div>
          )}
          <div className="sprint-game__btn-container">
            <button
              disabled={isDisabledBtn}
              onClick={() => handleGameStep(false)}
              className={`sprint-game__btn sprint-game__btn--no ${
                isDisabledBtn && "sprint-game__btn--disabled"
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
              disabled={isDisabledBtn}
              onClick={() => handleGameStep(true)}
              className={`sprint-game__btn sprint-game__btn--yes ${
                isDisabledBtn && "sprint-game__btn--disabled"
              }`}
            >
              верно
            </button>
          </div>
        </section>
      </main>
      {isGameEnded && <GameResultPage />}
    </div>
  );
};

export default SprintGamePage;
// {!isGameStarted && <GameResultPage />}
