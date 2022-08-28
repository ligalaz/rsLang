import { getValue } from "@testing-library/user-event/dist/utils";
import logo from "../../../../../public/manifest.json";
import React, { useEffect, useLayoutEffect, useState } from "react";
import { shallowEqual, useStore } from "react-redux";
import { useDispatch } from "react-redux";
import { IWord } from "../../../../interfaces/word";
import { audioService } from "../../../../services/audio-service";
import { useGetWordsMutation } from "../../../../services/words-service";
import { settingsUp } from "../../../../store/audiocall-settings-slice";
import { gameStep, startGame } from "../../../../store/audiocall-slice";
import { AppDispatch, useAppSelector } from "../../../../store/store";
import "./audiocall.scss";
import { CallIcon } from "../../../../components/icon/call-icon";
import OptionsComponent from "./options-component";

const AudioCallPage = (props: unknown) => {
  const dispatch: AppDispatch = useDispatch();
  const [getWords, { data, isLoading, isSuccess, isError }] =
    useGetWordsMutation();

  const { group, page, maxGroup, maxPage, allPlayWords } = useAppSelector(
    (state) => state.audioCallSettingsReducer,
    shallowEqual
  );
  const { currentWord, isGameStarted, dataBox, gameBox, playedBox } =
    useAppSelector((state) => state.audioCallReducer, shallowEqual);
  console.log(playedBox);

  const [groupValue, setGroup] = useState(String(group));
  const [pageValue, setPage] = useState(String(page));
  const [progressValue, setProgress] = useState("1");

  let isAnswer = false;

  useEffect(() => {
    getWords({
      group: +groupValue,
      page: +pageValue,
    });
  }, [groupValue, pageValue]);

  useEffect(() => {
    if (currentWord) {
      audioService(
        {
          audio: currentWord.audio,
          audioExample: currentWord.audioExample,
          audioMeaning: currentWord.audioMeaning,
        },
        false
      );
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
    } else {
      target.classList.add("game-false");
    }
    Array.from(
      document.querySelectorAll(
        ".game-element"
      ) as NodeListOf<HTMLButtonElement>
    ).forEach((item: HTMLButtonElement) =>
      item.id !== target.id ? (item.disabled = true) : null
    );
    return (isAnswer = true);
  }

  return (
    <div>
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
          onClick={() => dispatch(startGame({ dataBox: data }))}
        >
          Play
        </button>
      )}
      {!isGameStarted ? (
        <div>запустите игру</div>
      ) : (
        <div style={{ display: "flex", justifyContent: "center" }}>
          {currentWord ? (
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
              <CallIcon fill="white" className="word-repeater__logo" id="svg" />
            </button>
          ) : null}
        </div>
      )}
      <form className="settings-form">
        <label htmlFor="gamelevel">level</label>
        <select
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
        value={progressValue}
        max="20"
      ></progress>
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
      <div onClick={() => dispatch(gameStep({ dataBox: data }))}>NEXT PAGE</div>
    </div>
  );
};

export default AudioCallPage;
