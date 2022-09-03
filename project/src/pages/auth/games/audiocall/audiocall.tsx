import React, { useEffect, useRef, useState } from "react";
import { shallowEqual } from "react-redux";
import { useDispatch } from "react-redux";
import { audioService } from "../../../../services/audio-service";
import { useGetWordsMutation } from "../../../../services/words-service";
import {
  settingsUp,
  changeAnswer,
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
import OptionsComponent from "./options-component";
import CloseBtnComponent from "../close-btn-component";
import AudioCallRepeater from "./audiocall-repeater";
import AudioCallView from "./audiocall-view";
import AudiocallResult from "./audiocall-result";
import "./audiocall.scss";
import { IAuth } from "../../../../interfaces/auth";
import { useGetUserWordsMutation } from "../../../../services/aggregated-words-service";
import { Word } from "../../../../interfaces/word";
import {
  useGetUserStatisticsMutation,
  useUpdateUserStatisticsMutation,
} from "../../../../services/statistics-service";
import {
  useUpdateUserWordMutation,
  useCreateUserWordMutation,
} from "../../../../services/user-words-service";
import { getStartOfDayDate } from "../../../../utils/get-start-of-day-date";
import { Statistic } from "../../../../interfaces/statistic";
import { updateUserStatistics as updateStoreStatistics } from "../../../../store/statistics-slice";
import { UserWordResponse } from "../../../../interfaces/user-word";

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

  const [groupValue, setGroup] = useState(String(group));
  const [pageValue, setPage] = useState(String(page));
  const [trueGameAnswer, setTrue] = useState([]);
  const [falseGameAnswer, setFalse] = useState([]);
  const [trueWordRow, setRow] = useState(0);

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
      groupBlock.current.disabled = true;
      pageBlock.current.disabled = true;
    } else {
      groupBlock.current.disabled = false;
      pageBlock.current.disabled = false;
    }
    if (currentStep === allGameWords) {
      dispatch(endGame());
    }
  }, [currentWord]);

  useEffect(() => {
    const url = window.location.href;
    const queries = url.slice(-5).match(/\d+/gi) || [];
    if (queries.length) {
      groupBlock.current.disabled = true;
      pageBlock.current.disabled = true;
      const [group, page] = queries;
      setGroup(group);
      setPage(page);
      getWords({
        group: +group,
        page: +page,
      });
    }
  }, []);

  useEffect(() => {
    setRow(0);
    setTrue([]);
    setFalse([]);
  }, [isGameEnded]);

  useEffect(() => {
    if (isAnswer) {
      nextWordButton.current.focus();
    }
  }, [isAnswer]);

  function changeSelect(flag: boolean) {
    if (flag) {
      setGroup((event.target as HTMLSelectElement).value);
    } else {
      setPage((event.target as HTMLSelectElement).value);
    }
    dispatch(settingsUp({ page: +pageValue, group: +groupValue }));
  }

  async function checkTrueAnswer(event: React.MouseEvent) {
    const target = event.target as HTMLButtonElement;
    const isAttemptCorrect: boolean = target.id === currentWord.id;
    if (isAttemptCorrect) {
      target.classList.add("game-true");
      setTrue(trueGameAnswer.concat(currentWord));
      setRow(trueWordRow + 1);
      currentStep === 9
        ? dispatch(setTrueRaw({ trueRow: trueWordRow + 1 }))
        : null;
    } else {
      target.classList.add("game-false");
      setFalse(falseGameAnswer.concat(currentWord));
      dispatch(setTrueRaw({ trueRow: trueWordRow }));
      setRow(0);
    }
    await updateUserWordStatistic(isAttemptCorrect);
    dispatch(changeAnswer({ isAnswer: true }));
  }

  async function updateUserWordStatistic(
    isAttemptCorrect: boolean
  ): Promise<void> {
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
    setFalse(falseGameAnswer.concat(currentWord));
    dispatch(setTrueRaw({ trueRow: trueWordRow }));
    updateUserWordStatistic(false);
    setRow(0);
    dispatch(
      gameStep({
        dataBox: words,
        trueAnswer: trueGameAnswer,
        falseAnswer: falseGameAnswer,
      })
    );
  }

  console.log(statistics);
  console.log(auth.userId);
  return (
    <div className="audiocall-body">
      <div className="audiocall__row">
        <div className="audiocall__row-header">
          {isGameStarted ? (
            <button
              className="play-btn"
              disabled
              onClick={() => dispatch(startGame({ dataBox: words }))}
            >
              Play
            </button>
          ) : (
            <button
              className="play-btn"
              onClick={() => {
                dispatch(startGame({ dataBox: words }));
              }}
            >
              Play
            </button>
          )}
          <CloseBtnComponent className="audiocall__row-close" />
        </div>
        <div className="audiocall__row-view">
          {!isGameStarted ? (
            <AudioCallRepeater
              className="audiocall__row-view-item word-repeater"
              isCall={false}
            />
          ) : !currentWord ? null : isAnswer ? (
            <AudioCallView current={currentWord} />
          ) : (
            <AudioCallRepeater
              className="audiocall__row-view-item word-repeater"
              isCall={true}
              current={currentWord}
            />
          )}
        </div>
        <div className="audiocall__row-control">
          <form className="settings-form">
            <label htmlFor="gamelevel">level</label>
            <select
              ref={groupBlock}
              value={groupValue}
              onChange={changeSelect.bind(this, true)}
              id="gamelevel"
              name="unittype"
              required
            >
              <OptionsComponent counter={maxGroup} />
            </select>
            <label htmlFor="gamepage">page</label>
            <select
              ref={pageBlock}
              value={pageValue}
              onChange={changeSelect.bind(this, false)}
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
          <div className="word-repeater__row">
            {!isGameStarted
              ? null
              : !isAnswer
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
            {!isGameStarted ? (
              <div className="btn-preload ">
                Press the play button to start the game
              </div>
            ) : isAnswer ? (
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
        {isGameEnded ? <AudiocallResult /> : null}
      </div>
    </div>
  );
};

export default AudioCallPage;
