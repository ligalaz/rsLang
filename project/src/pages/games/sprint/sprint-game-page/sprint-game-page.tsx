import React, { useEffect, useState } from "react";
import {
  useAppSelector,
  RootState,
  AppDispatch,
} from "../../../../store/store";
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
import { Statistic } from "../../../../interfaces/statistic";
import { updateUserStatistics as updateStoreStatistics } from "../../../../store/statistics-slice";
import {
  useGetUserStatisticsMutation,
  useUpdateUserStatisticsMutation,
} from "../../../../services/statistics-service";
import { getStartOfDayDate } from "../../../../utils/get-start-of-day-date";
import {
  useCreateUserWordMutation,
  useUpdateUserWordMutation,
} from "../../../../services/user-words-service";
import { UserWordResponse } from "../../../../interfaces/user-word";
import { useDispatch } from "react-redux";

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
  const dispatch: AppDispatch = useDispatch();
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

  const [getUserStatistics, { isSuccess: isUserStatisticsSuccess }] =
    useGetUserStatisticsMutation();
  const [updateUserStatistics] = useUpdateUserStatisticsMutation();
  const [updateUserWord] = useUpdateUserWordMutation();
  const [createUserWord] = useCreateUserWordMutation();

  const isLoadingData = isLoading || isAggregatedWordsLoading;
  const isDisabledBtn = !isGameStarted || isGameEnded || isLoadingData;
  const isDisabledThroughoutGame = isGameStarted || isGameEnded;
  const isDisabledStartGame = isGameStarted && !isLoadingData;

  const [currentStep, setCurrentStep] = useState(0);
  const [indicatorClassName, setIndicatorClassName] = useState("");

  const [sound, setSound] = useState(true);

  const statistics: Statistic = useAppSelector(
    (state: RootState) => state.statisticsState?.statistics
  );

  async function updateUserWordStatistic(
    isAttemptCorrect: boolean
  ): Promise<void> {
    const request: UserWordResponse = {
      id: auth?.userId,
      wordId: gameData.at(-1).id,
    };
    const seria: number = statistics?.optional?.sprint?.seria || 0;
    const maxSeria: number = statistics?.optional?.sprint?.maxSeria || 0;
    const wordStrick: number = gameData.at(-1).userWord?.optional?.strick || 0;
    const wordAttempts: number =
      gameData.at(-1).userWord?.optional?.sprint?.attempts || 0;
    const wordGuesses: number =
      gameData.at(-1).userWord?.optional?.sprint?.guesses || 0;
    const statisticsAttempts: number =
      statistics?.optional?.sprint?.[getStartOfDayDate()]?.attempts || 0;
    const statisticsGuesses: number =
      statistics?.optional?.sprint?.[getStartOfDayDate()]?.guesses || 0;
    const shouldWordMarkAsLearned: boolean =
      isAttemptCorrect &&
      ((gameData.at(-1).userWord?.difficulty === "seen" && wordStrick == 1) ||
        (gameData.at(-1).userWord?.difficulty === "hard" && wordStrick == 4));
    const shouldWorkRemoveFromLearned: boolean =
      !isAttemptCorrect && gameData.at(-1).userWord?.difficulty === "learned";

    if (!gameData.at(-1).userWord) {
      request.difficulty = "seen";
      request.optional = {
        firstSeenDate: getStartOfDayDate(),
        strick: +isAttemptCorrect,
        sprint: {
          attempts: 1,
          guesses: +isAttemptCorrect,
        },
      };
    } else {
      request.optional = {
        ...gameData.at(-1).userWord.optional,
        strick: isAttemptCorrect ? wordStrick + 1 : 0,
        sprint: {
          attempts: wordAttempts + 1,
          guesses: wordGuesses + +isAttemptCorrect,
        },
      };

      if (shouldWordMarkAsLearned) {
        request.difficulty = "learned";
        request.optional.learnedDate = getStartOfDayDate();
      } else if (shouldWorkRemoveFromLearned) {
        request.difficulty = "seen";
        delete request?.optional?.learnedDate;
      } else {
        request.difficulty = gameData.at(-1).userWord.difficulty;
      }
    }

    if (!gameData.at(-1).userWord) {
      createUserWord(request);
    } else {
      updateUserWord(request);
    }

    dispatch(
      updateStoreStatistics(
        Statistic.fromDto({
          learnedWords:
            (statistics?.learnedWords || 0) +
            (+shouldWordMarkAsLearned - +shouldWorkRemoveFromLearned),
          optional: {
            ...statistics?.optional,
            sprint: {
              seria: isAttemptCorrect ? seria + 1 : 0,
              maxSeria:
                isAttemptCorrect && seria + 1 > maxSeria ? seria + 1 : maxSeria,
              [getStartOfDayDate()]: {
                attempts: statisticsAttempts + 1,
                guesses: statisticsGuesses + +isAttemptCorrect,
              },
            },
          },
        })
      )
    );
  }

  const handleGameStep = (isRightBtn: boolean) => {
    console.log("currentword", gameData.at(-1));
    const isTrueAnswer = isRightBtn
      ? gameData.at(-1).wordTranslate === currentWord.wordTranslate
      : gameData.at(-1).wordTranslate !== currentWord.wordTranslate;
    setIndicatorClassName("");
    changeGameScore(isTrueAnswer);
    audio.src = isTrueAnswer ? tick : cross;
    sound ? audio.play() : audio.pause();

    if (auth) {
      updateUserWordStatistic(isTrueAnswer);
    }

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
    if (auth?.userId) {
      updateUserStatistics({
        userId: auth?.userId,
        request: { ...statistics },
      });
    }
  }, [statistics]);

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
        getUserStatistics(auth.userId);
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
  console.log(isUserStatisticsSuccess);
  console.log("statistics", statistics);
  console.log(auth.userId);

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
