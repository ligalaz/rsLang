import React, { useEffect, useRef, useState } from "react";
import { shallowEqual } from "react-redux";
import { useDispatch } from "react-redux";
import { audioService } from "../../../../services/audio-service";

import {
  changeAnswer,
  setTrueRaw,
} from "../../../../store/audiocall-settings-slice";
import { endGame, gameStep } from "../../../../store/audiocall-slice";
import {
  AppDispatch,
  RootState,
  useAppSelector,
} from "../../../../store/store";
import { CallIcon } from "../../../../components/icon/call-icon";
import OptionsComponent from "../components/audiocall-select/options-component";
import CloseBtnComponent from "../components/audiocall-close-btn/close-btn-component";
import AudioCallRepeater from "../components/audiocall-repeater/audiocall-repeater";
import AudioCallView from "../components/audiocall-view/audiocall-view";
import { IAuth } from "../../../../interfaces/auth";

import { Word } from "../../../../interfaces/word";
import { useUpdateUserStatisticsMutation } from "../../../../services/statistics-service";
import {
  useUpdateUserWordMutation,
  useCreateUserWordMutation,
} from "../../../../services/user-words-service";
import { getStartOfDayDate } from "../../../../utils/get-start-of-day-date";
import { IStatistic } from "../../../../interfaces/statistic";
import { UserWordResponse } from "../../../../interfaces/user-word";
import GameStartScreen from "../start-screen/game-start-screen.component";
import GameResultPage from "../game-result-page/audiocall-result";
import "./audiocall.scss";
import tick from "../../../../assets/sound/tick.mp3";
import cross from "../../../../assets/sound/cross.mp3";

const AudioCallPage = (props?: unknown) => {
  const auth: IAuth = useAppSelector(
    (state: RootState) => state.authState?.auth
  );

  const userId = auth?.userId;
  const dispatch: AppDispatch = useDispatch();

  const [updateUserStatistics] = useUpdateUserStatisticsMutation();
  const [updateUserWord] = useUpdateUserWordMutation();
  const [createUserWord] = useCreateUserWordMutation();

  const { maxGroup, maxPage, allGameWords, isAnswer, trueRow } = useAppSelector(
    (state: RootState) => state.audioCallSettingsReducer,
    shallowEqual
  );
  const { currentWord, isGameStarted, gameBox, currentStep, isGameEnded } =
    useAppSelector((state: RootState) => state.audioCallReducer, shallowEqual);

  const words: Word[] = useAppSelector(
    (state: RootState) => state.wordsState.words || []
  );

  const statistics: IStatistic = useAppSelector(
    (state: RootState) => state.statisticsState?.statistics
  );

  const [trueGameAnswer, setTrue] = useState([]);
  const [falseGameAnswer, setFalse] = useState([]);
  const [trueWordRow, setRow] = useState(0);
  const [alpha, setAlpha] = useState(0.8);

  const nextWordButton = useRef(null);
  const dontKnowWordButton = useRef(null);

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
  }, [currentWord]);

  useEffect(() => {
    setAlpha(0.8);
    setRow(0);
    setTrue([]);
    setFalse([]);
  }, [isGameEnded]);

  useEffect(() => {
    if (isAnswer) {
      nextWordButton.current.focus();
    }
  }, [isAnswer]);

  function checkTrueAnswer(event: React.MouseEvent) {
    const target = event.target as HTMLButtonElement;
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

    updateUserStatistics({
      userId: userId,
      request: {
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
      },
    });
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
    setRow(0);
    dispatch(changeAnswer({ isAnswer: true }));
  }

  console.log("statistics", statistics?.learnedWords);
  console.log("statistics", statistics?.optional?.audioCall);

  return (
    <div className="audiocall-body">
      <div
        style={{ background: `rgba(255,255,255,${alpha})` }}
        className="audiocall__row"
      >
        {!isGameStarted ? (
          <div className="audiocall__row-header">
            <GameStartScreen gameName={`audiocall`} words={words} />
          </div>
        ) : (
          <>
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
              <form className="row-view__settings-form">
                <label htmlFor="gamelevel">level</label>
                <select
                  disabled
                  value={window.localStorage.getItem("saveGroup")}
                  id="gamelevel"
                  name="unittype"
                  required
                >
                  <OptionsComponent counter={maxGroup} />
                </select>
                <label htmlFor="gamepage">page</label>
                <select
                  disabled
                  value={window.localStorage.getItem("savePage")}
                  id="gamepage"
                  name="type"
                  required
                >
                  <OptionsComponent counter={maxPage} />
                </select>
              </form>
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
              <div className="audiocall__row-playground-word-repeater__row">
                {!isAnswer
                  ? gameBox.map((item) => (
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
          </>
        )}
        {isGameEnded ? <GameResultPage /> : null}
      </div>
    </div>
  );
};

export default AudioCallPage;
