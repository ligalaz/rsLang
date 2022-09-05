import React, { useEffect, useRef, useState } from "react";
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
import CloseBtn from "../../../../components/close-btn/close-btn";
import AudioBtn from "../components/audio/audio-btn";
import ProgressLabels from "../components/progress-labels/progress-labels";
import GameResultPage from "../game-result-page/game-result-page";
import { GetWordsRequest, Word } from "../../../../interfaces/word";
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
import { GameStartScreen } from "../../../../components/game-start-screen/game-start-screen";
import { useNavigate, useSearchParams } from "react-router-dom";
import { notify } from "../../../../utils/notifications";
import { toast } from "react-toastify";
import { useEventListener } from "usehooks-ts";

const defaultTimerDetails = {
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
    page,
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
  const [currentStep, setCurrentStep] = useState(0);
  const [indicatorClassName, setIndicatorClassName] = useState("");
  const [sound, setSound] = useState(true);
  const [mode, setMode] = useState<"textbook" | "main">("main");
  const [searchParams, setSearchParams] = useSearchParams();
  const [timerSettings, setTimerSettings] = useState(defaultTimerDetails);
  const documentRef = useRef<Document>(document);

  const navigate = useNavigate();

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
      ((gameData.at(-1).userWord?.difficulty === "seen" && wordStrick == 2) ||
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

  function handleKeyboardEvent(event: KeyboardEvent) {
    const { code, repeat } = event;
    if (!repeat && !isGameEnded) {
      switch (code) {
        case "ArrowRight":
          handleGameStep(true);
          break;
        case "ArrowLeft":
          handleGameStep(false);
          break;
        default:
          break;
      }
    }
  }

  useEffect(() => {
    if (auth?.userId) {
      updateUserStatistics({
        userId: auth?.userId,
        request: { ...statistics },
      });
    }
  }, [statistics]);

  useEffect(() => {
    const group = searchParams.get("group");
    const page = searchParams.get("page");
    if (group) {
      setMode("textbook");
      setLevel({ level: group, page: page ?? "0" });
    }
  }, [searchParams]);

  useEffect(() => {
    if (isSuccess || isAggregatedWordsSuccess) {
      if (mode === "textbook") {
        if (level === "6" && words.length < 20) {
          notify(
            "Lack words count for game. Please add more difficult words",
            toast.warning
          );
          navigate("/main", { replace: true });
        }
        if (words.length < 120) {
          setTimerSettings({
            ...defaultTimerDetails,
            initial: words.length * 0.5,
          });
        }
      }
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

  function getProperlyWords(): void {
    const request: GetWordsRequest = prepareRequest();
    if (auth) {
      getAggregatedWords({ userId: auth.userId, params: request });
    } else {
      getWords(request);
    }
  }

  function prepareRequest(): GetWordsRequest {
    const request: GetWordsRequest = {};
    switch (mode) {
      case "main":
        request.group = +level;
        request.wordsPerPage = 600;
        break;
      case "textbook":
        if (request.group === 6) {
          request.filter = '{"userWord.difficulty":"hard"}';
          request.wordsPerPage = 3600;
        } else {
          request.group = +level;
          request.wordsPerPage = (+page + 1) * 20;
        }
        break;
      default:
        break;
    }
    return request;
  }

  useEventListener("keydown", handleKeyboardEvent, documentRef);

  return (
    <>
      {!isGameStarted && !isGameEnded && (
        <GameStartScreen
          mode={mode}
          group={+level}
          onGroupSelect={(group: number) =>
            setLevel({ level: `${group}`, page })
          }
          page={+page}
          onPageSelect={(page: number) => setLevel({ level, page: `${page}` })}
          onTimerStart={() => getProperlyWords()}
          onTimerFinish={() => setGameStart()}
          game="sprint"
        />
      )}
      <div className="container">
        <header className="header">
          <CloseBtn isDisabled={isGameEnded} />
        </header>
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
                isDisabled={isDisabledBtn}
                setSound={() => setSound(!sound)}
              />
            </div>
            {isDisabledThroughoutGame && (
              <Timer
                timerDetails={timerSettings}
                endTimer={() => setGameEnd()}
                isStarted={isGameStarted}
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
      </div>
      {isGameEnded && <GameResultPage />}
    </>
  );
};

export default SprintGamePage;
