import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { shallowEqual } from "react-redux";
import { useDispatch } from "react-redux";
import { audioService } from "../../../../services/audio-service";
import { useGetWordsMutation } from "../../../../services/words-service";
import { settingsUp } from "../../../../store/audiocall-settings-slice";
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
import "./audiocall.scss";
import { CallIcon } from "../../../../components/icon/call-icon";
import OptionsComponent from "./options-component";
import CloseBtnComponent from "../close-btn-component";
import { API_BASE_URL } from "../../../../config";
const AudioCallPage = (props?: unknown) => {
  const dispatch: AppDispatch = useDispatch();
  const [getWords, { data }] = useGetWordsMutation();

  const { group, page, maxGroup, maxPage, allGameWords } = useAppSelector(
    (state: RootState) => state.audioCallSettingsReducer,
    shallowEqual
  );
  const { currentWord, isGameStarted, gameBox, currentStep } = useAppSelector(
    (state: RootState) => state.audioCallReducer,
    shallowEqual
  );

  const [groupValue, setGroup] = useState(String(group));
  const [pageValue, setPage] = useState(String(page));
  const [trueGameAnswer, setTrue] = useState([]);
  const [falseGameAnswer, setFalse] = useState([]);

  const nextWordButton = useRef(null);
  const dontKnowWordButton = useRef(null);
  const customSelect = useRef(null);
  const test = useRef(null);

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
    }
    if (currentStep === allGameWords) {
      nextWordButton.current.disabled = true;
      dispatch(endGame());
      Array.from(
        document.querySelectorAll(
          ".game-element"
        ) as NodeListOf<HTMLButtonElement>
      ).forEach((item: HTMLButtonElement) => (item.disabled = true));
    }
  }, [currentWord]);

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
    } else {
      target.classList.add("game-false");
      setFalse(falseGameAnswer.concat(currentWord));
    }
    test.current.style.background = `red`;
    disableChoiseAnswer(target);
  }

  function disableChoiseAnswer(target: HTMLButtonElement) {
    Array.from(
      document.querySelectorAll(
        ".game-element"
      ) as NodeListOf<HTMLButtonElement>
    ).forEach((item: HTMLButtonElement) =>
      item.id !== target.id ? (item.disabled = true) : null
    );
    dontKnowWordButton.current.style.display = "none";
    nextWordButton.current.style.display = "block";
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
    nextWordButton.current.style.display = "none";
    dontKnowWordButton.current.style.display = "block";
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
                dontKnowWordButton.current.style.display = "block";
              }}
            >
              Play
            </button>
          )}
          <CloseBtnComponent />
        </div>
        <div className="audiocall__row-view">
          {!isGameStarted ? (
            <div style={{ display: "flex", justifyContent: "center" }}>
              {
                <button className="word-repeater">
                  <CallIcon
                    fill="white"
                    className="word-repeater__logo"
                    id="svg"
                  />
                </button>
              }
            </div>
          ) : (
            <div style={{ display: "flex", justifyContent: "center" }}>
              {currentWord ? (
                <>
                  {
                    <div
                      className="imgimg"
                      style={{
                        background: `url(${API_BASE_URL}/${currentWord.image}) center center`,
                        backgroundSize: "contain",
                      }}
                    ></div>
                  }
                  <button
                    className="word-repeater"
                    onClick={() =>
                      audioService(
                        {
                          audio: currentWord.audio,
                          audioExample: currentWord.audioExample,
                          audioMeaning: currentWord.audioMeaning,
                        },
                        false
                      )
                    }
                  >
                    <CallIcon
                      fill="white"
                      className="word-repeater__logo"
                      id="svg"
                    />
                  </button>
                  <div>{currentWord.word}</div>
                </>
              ) : null}
            </div>
          )}
        </div>
        <div className="audiocall__row-control">
          <form className="settings-form">
            <label htmlFor="gamelevel">level</label>
            <select
              disabled
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
              : gameBox.map((item) => (
                  <button
                    onClick={checkTrueAnswer}
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
            <button
              className="audiocall__btn-container-item next"
              ref={nextWordButton}
              style={{ display: "none" }}
              onClick={() => resetBeforeNextRound()}
            >
              <CallIcon fill="ffffff" className="vector" id="vector" />
            </button>
            <button
              className="audiocall__btn-container-item"
              ref={dontKnowWordButton}
              style={{ display: "none" }}
              onClick={() => resetBeforeNextRound()}
            >
              {`I don't know`}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AudioCallPage;
