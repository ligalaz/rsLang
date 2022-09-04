import React, { useEffect, useRef, useState } from "react";
import { shallowEqual } from "react-redux";
import { useDispatch } from "react-redux";
import { audioService } from "../../../../services/audio-service";

import {
  changeAnswer,
  settingsUp,
  setTrueRaw,
} from "../../../../store/audiocall-settings-slice";
import {
  endGame,
  gameStep,
  startGame,
} from "../../../../store/audiocall-slice";
import {
  AppDispatch,
  RootState,
  useAppSelector,
} from "../../../../store/store";
import { CallIcon } from "../../../../components/icon/call-icon";
import CloseBtnComponent from "../components/audiocall-close-btn/close-btn-component";
import AudioCallRepeater from "../components/audiocall-repeater/audiocall-repeater";
import AudioCallView from "../components/audiocall-view/audiocall-view";
import { IAuth } from "../../../../interfaces/auth";

import { Word } from "../../../../interfaces/word";
import {
  useGetUserStatisticsMutation,
  useUpdateUserStatisticsMutation,
} from "../../../../services/statistics-service";
import {
  useUpdateUserWordMutation,
  useCreateUserWordMutation,
} from "../../../../services/user-words-service";
import { useGetUserWordsMutation } from "../../../../services/aggregated-words-service";
import { getStartOfDayDate } from "../../../../utils/get-start-of-day-date";
import { Statistic } from "../../../../interfaces/statistic";
import { updateUserStatistics as updateStoreStatistics } from "../../../../store/statistics-slice";
import { UserWordResponse } from "../../../../interfaces/user-word";
import GameResultPage from "../game-result-page/audiocall-result";
import "./audiocall.scss";
import tick from "../../../../assets/sound/tick.mp3";
import cross from "../../../../assets/sound/cross.mp3";
import { is } from "immer/dist/internal";
import { useGetWordsMutation } from "../../../../services/words-service";
import { GameStartScreen } from "../../../../components/game-start-screen/game-start-screen";
import { useSearchParams } from "react-router-dom";

const AudioCallPage = (props?: unknown) => {
  const auth: IAuth = useAppSelector(
    (state: RootState) => state.authState?.auth
  );

  const userId = auth?.userId;
  const dispatch: AppDispatch = useDispatch();
  const [getWords] = useGetWordsMutation();
  const [getAggregatedWords] = useGetUserWordsMutation();
  const [getUserStatistics, { isSuccess: isUserStatisticsSuccess }] =
    useGetUserStatisticsMutation();
  const [updateUserStatistics] = useUpdateUserStatisticsMutation();
  const [updateUserWord] = useUpdateUserWordMutation();
  const [createUserWord] = useCreateUserWordMutation();

  const [searchParams, setSearchParams] = useSearchParams();

  const { group, page, maxGroup, maxPage, allGameWords, isAnswer, trueRow } =
    useAppSelector(
      (state: RootState) => state.audioCallSettingsReducer,
      shallowEqual
    );

  const { currentWord, isGameStarted, gameBox, currentStep, isGameEnded } =
    useAppSelector((state: RootState) => state.audioCallReducer, shallowEqual);

  const words: Word[] = useAppSelector(
    (state: RootState) => state.wordsState.words || []
  );

  const statistics: Statistic = useAppSelector(
    (state: RootState) => state.statisticsState?.statistics
  );

  const [trueGameAnswer, setTrue] = useState([]);
  const [falseGameAnswer, setFalse] = useState([]);
  const [trueWordRow, setRow] = useState(0);
  const [alpha, setAlpha] = useState(0.8);
  const gameElements = useRef();

  const [groupValue, setGroup] = useState<number>(null);
  const [pageValue, setPage] = useState<number>(null);
  const [mode, setMode] = useState<"textbook" | "main">("main");

  const nextWordButton = useRef(null);
  const dontKnowWordButton = useRef(null);
  const groupBlock = useRef(null);
  const pageBlock = useRef(null);

  useEffect(() => {
    if (auth?.userId) {
      updateUserStatistics({
        userId: userId,
        request: { ...statistics },
      });
    }
  }, [statistics]);

  useEffect(() => {
    if (auth?.userId) {
      getAggregatedWords({
        userId,
        params: {
          group: +groupValue,
          page: +pageValue,
          wordsPerPage: 20,
        },
      });
      getUserStatistics(auth.userId);
    } else {
      getWords({
        group: +groupValue,
        page: +pageValue,
      });
    }
  }, [groupValue, pageValue]);

  useEffect(() => {
    if (currentWord && currentStep < allGameWords) {
      audioService(
        {
          audio: currentWord.audio,
          audioExample: currentWord.audioExample,
          audioMeaning: currentWord.audioMeaning,
        },
        false
      );
    }

    if (currentStep === allGameWords) {
      dispatch(endGame());
    }

    if (currentWord) {
      const answers = (gameElements.current as Element).children;
      document.onkeydown = (event) => {
        switch (event.code) {
          case "Digit0":
            skipWord();
            break;
          case "Digit1":
            checker(answers[0] as HTMLButtonElement);
            break;
          case "Digit2":
            checker(answers[1] as HTMLButtonElement);
            break;
          case "Digit3":
            checker(answers[2] as HTMLButtonElement);
            break;
          case "Digit4":
            checker(answers[3] as HTMLButtonElement);
            break;
          case "Digit5":
            checker(answers[4] as HTMLButtonElement);
            break;
          default:
            break;
        }
      };
    }

    return () => (document.onkeydown = null);
  }, [currentWord]);

  useEffect(() => {
    setAlpha(0.8);
    setRow(0);
    setTrue([]);
    setFalse([]);
    document.onkeydown = null;
  }, [isGameEnded]);

  useEffect(() => {
    if (isAnswer) {
      nextWordButton.current.focus();
    }
    isAnswer
      ? (document.onkeydown = (event) => {
          if (event.code === "ArrowRight") {
            resetBeforeNextRound();
          }
        })
      : null;
  }, [isAnswer]);

  useEffect(() => {
    const group = searchParams.get("group");
    const page = searchParams.get("page");
    if (group) {
      setMode("textbook");
      setGroup(parseInt(group));
      if (page) {
        setPage(parseInt(page));
      }
    }
  }, [searchParams]);

  function getProperlyWords(): void {
    if (auth?.userId) {
      getAggregatedWords({
        userId,
        params: {
          group: +groupValue,
          page: +pageValue,
          wordsPerPage: 20,
        },
      });
      getUserStatistics(auth.userId);
    } else {
      getWords({
        group: +groupValue,
        page: +pageValue,
      });
    }
  }

  function checker(target: HTMLButtonElement) {
    const isAttemptCorrect: boolean = target.id === currentWord.id;
    if (isAttemptCorrect) {
      audioService({ audio: "" }, false, tick);
      target.classList.add("game-true");
      setTrue(trueGameAnswer.concat(currentWord));
      setRow(trueWordRow + 1);
      currentStep === 9
        ? dispatch(setTrueRaw({ trueRow: trueWordRow + 1 }))
        : null;
    } else {
      audioService({ audio: "" }, false, cross);
      target.classList.add("game-false");
      setFalse(falseGameAnswer.concat(currentWord));
      dispatch(setTrueRaw({ trueRow: trueWordRow }));
      setRow(0);
    }
    updateUserWordStatistic(isAttemptCorrect);
    dispatch(changeAnswer({ isAnswer: true }));
  }

  function checkTrueAnswer(event: React.MouseEvent | React.KeyboardEvent) {
    const target = event.target as HTMLButtonElement;
    checker(target);
  }

  function updateUserWordStatistic(isAttemptCorrect: boolean): void {
    const request: UserWordResponse = {
      id: auth?.userId,
      wordId: currentWord.id,
    };
    const seria: number = statistics?.optional?.audioCall?.seria || 0;
    const maxSeria: number = statistics?.optional?.audioCall?.maxSeria || 0;
    const wordStrick: number = currentWord.userWord?.optional?.strick || 0;
    const wordAttempts: number =
      currentWord.userWord?.optional?.audioCall?.attempts || 0;
    const wordGuesses: number =
      currentWord.userWord?.optional?.audioCall?.guesses || 0;
    const statisticsAttempts: number =
      statistics?.optional?.audioCall?.[getStartOfDayDate()]?.attempts || 0;
    const statisticsGuesses: number =
      statistics?.optional?.audioCall?.[getStartOfDayDate()]?.guesses || 0;
    const shouldWordMarkAsLearned: boolean =
      isAttemptCorrect &&
      ((currentWord.userWord?.difficulty === "seen" && wordStrick == 1) ||
        (currentWord.userWord?.difficulty === "hard" && wordStrick == 4));
    const shouldWorkRemoveFromLearned: boolean =
      !isAttemptCorrect && currentWord.userWord?.difficulty === "learned";

    if (!currentWord.userWord) {
      request.difficulty = "seen";
      request.optional = {
        firstSeenDate: getStartOfDayDate(),
        strick: +isAttemptCorrect,
        audioCall: {
          attempts: 1,
          guesses: +isAttemptCorrect,
        },
      };
    } else {
      request.optional = {
        ...currentWord.userWord.optional,
        strick: isAttemptCorrect ? wordStrick + 1 : 0,
        audioCall: {
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
        request.difficulty = currentWord.userWord.difficulty;
      }
    }

    if (!currentWord.userWord) {
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
            audioCall: {
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

  function resetBeforeNextRound() {
    Array.from(
      document.querySelectorAll(
        ".game-element"
      ) as NodeListOf<HTMLButtonElement>
    ).forEach((item: HTMLButtonElement) => {
      item.disabled = false;
      item.classList.remove("game-true");
      item.classList.remove("game-false");
    });
    setAlpha(alpha - 0.1);

    dispatch(
      gameStep({
        dataBox: words,
        trueAnswer: trueGameAnswer,
        falseAnswer: falseGameAnswer,
      })
    );
    dispatch(changeAnswer({ isAnswer: false }));
  }

  function skipWord() {
    audioService({ audio: "" }, false, cross);
    setFalse(falseGameAnswer.concat(currentWord));
    updateUserWordStatistic(false);
    dispatch(setTrueRaw({ trueRow: trueWordRow }));
    updateUserWordStatistic(false);
    setRow(0);
    dispatch(changeAnswer({ isAnswer: true }));
  }

  return (
    <>
      {!isGameStarted ? (
        <GameStartScreen
          mode={mode}
          group={groupValue}
          onGroupSelect={(group: number) => setGroup(group)}
          page={pageValue}
          onPageSelect={(page: number) => setPage(page)}
          onTimerStart={() => getProperlyWords()}
          onTimerFinish={() => dispatch(startGame({ dataBox: words }))}
          game="audiocall"
        />
      ) : (
        <div className="audiocall-body">
          <div
            style={{ background: `rgba(255,255,255,${alpha})` }}
            className="audiocall__row"
          >
            <div className="audiocall__row-view">
              <div className="audiocall__row-close">
                <CloseBtnComponent />
              </div>
              <div className="audiocall__row-repeater-view">
                {isAnswer ? (
                  <AudioCallView current={currentWord} />
                ) : (
                  <AudioCallRepeater
                    className="audiocall__row-view-item word-repeater"
                    isCall={true}
                    current={currentWord}
                  />
                )}
              </div>
            </div>
            <div className="audiocall__row-control">
              <progress
                style={{
                  width: "100%",
                  height: "20px",
                }}
                value={String(currentStep)}
                max={String(allGameWords)}
              ></progress>
            </div>
            <div className="audiocall__row-playground">
              <div
                ref={gameElements}
                className="audiocall__row-playground-word-repeater__row"
              >
                {!isAnswer
                  ? gameBox.map((item, idx: number) => (
                      <button
                        onClick={checkTrueAnswer}
                        className="game-element"
                        id={item.id}
                        key={item.id}
                      >
                        {item.wordTranslate}
                      </button>
                    ))
                  : gameBox.map((item) => (
                      <button
                        disabled
                        className="game-element"
                        id={item.id}
                        key={item.id}
                      >
                        {item.wordTranslate}
                      </button>
                    ))}
              </div>
            </div>
            <div className="audiocall__row-toggle">
              <div className="audiocall__btn-container">
                {isGameEnded ? null : isAnswer ? (
                  <button
                    className="audiocall__btn-container-item btn-next"
                    ref={nextWordButton}
                    onClick={() => resetBeforeNextRound()}
                  >
                    <CallIcon fill="ffffff" className="vector" id="vector" />
                  </button>
                ) : (
                  <button
                    className="audiocall__btn-container-item"
                    ref={dontKnowWordButton}
                    onClick={() => skipWord()}
                  >
                    {`I don't know`}
                  </button>
                )}
              </div>
            </div>
            {isGameEnded ? <GameResultPage /> : null}
          </div>
        </div>
      )}
    </>
  );
};

export default AudioCallPage;
