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

const AudioCallPage = (props?: unknown) => {
  const dispatch: AppDispatch = useDispatch();
  const [getWords, { data }] = useGetWordsMutation();

  const { group, page, maxGroup, maxPage, allGameWords, isAnswer, trueRow } =
    useAppSelector(
      (state: RootState) => state.audioCallSettingsReducer,
      shallowEqual
    );
  const { currentWord, isGameStarted, gameBox, currentStep, isGameEnded } =
    useAppSelector((state: RootState) => state.audioCallReducer, shallowEqual);

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
    getWords({
      group: +groupValue,
      page: +pageValue,
    });
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

  function checkTrueAnswer(event: React.MouseEvent) {
    const target = event.target as HTMLButtonElement;
    if (target.id === currentWord.id) {
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
    dispatch(changeAnswer({ isAnswer: true }));
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
        dataBox: data,
        trueAnswer: trueGameAnswer,
        falseAnswer: falseGameAnswer,
      })
    );
    dispatch(changeAnswer({ isAnswer: false }));
  }

  function skipWord() {
    setFalse(falseGameAnswer.concat(currentWord));
    dispatch(setTrueRaw({ trueRow: trueWordRow }));
    setRow(0);
    dispatch(
      gameStep({
        dataBox: data,
        trueAnswer: trueGameAnswer,
        falseAnswer: falseGameAnswer,
      })
    );
  }

  return (
    <div className="audiocall-body">
      <div className="audiocall__row">
        <div className="audiocall__row-header">
          {isGameStarted ? (
            <button
              className="play-btn"
              disabled
              onClick={() => dispatch(startGame({ dataBox: data }))}
            >
              Play
            </button>
          ) : (
            <button
              className="play-btn"
              onClick={() => {
                dispatch(startGame({ dataBox: data }));
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
