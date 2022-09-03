import React, { useEffect, useRef, useState } from "react";
import {
  AppDispatch,
  RootState,
  useAppSelector,
} from "../../../../store/store";
import { shallowEqual, useDispatch } from "react-redux";
import { useNavigate } from "react-router";
import { IAuth } from "../../../../interfaces/auth";
import { IWord } from "../../../../interfaces/word";
import { useGetUserStatisticsMutation } from "../../../../services/statistics-service";
import { useGetUserWordsMutation } from "../../../../services/aggregated-words-service";
import { useGetWordsMutation } from "../../../../services/words-service";
import {
  settingsUp,
  timerUp,
} from "../../../../store/audiocall-settings-slice";
import { startGame } from "../../../../store/audiocall-slice";

import OptionsComponent from "../components/audiocall-select/options-component";
import CloseBtnComponent from "../components/audiocall-close-btn/close-btn-component";

import "./game-screen.scss";
import { nextTick } from "process";

export interface IStartScreenProps {
  gameName?: "sprint" | "audiocall";
  words?: IWord[];
}

const GameStartScreen = ({ gameName, words }: IStartScreenProps) => {
  const auth: IAuth = useAppSelector(
    (state: RootState) => state.authState?.auth
  );

  const userId = auth?.userId;

  const dispatch: AppDispatch = useDispatch();
  const navigate = useNavigate();
  const { group, page, maxGroup, maxPage, isTimerStart } = useAppSelector(
    (state: RootState) => state.audioCallSettingsReducer,
    shallowEqual
  );

  const [timeStart, setTimeStart] = useState(5);
  const [paused, setPaused] = useState(false);
  const [groupValue, setGroup] = useState(String(group));
  const [pageValue, setPage] = useState(String(page));

  const [getWords] = useGetWordsMutation();
  const [getAggregatedWords] = useGetUserWordsMutation();
  const [getUserStatistics] = useGetUserStatisticsMutation();

  const groupBlock = useRef(null);
  const pageBlock = useRef(null);

  const timer = () => {
    if (paused) return;
    setTimeStart((timeStart: number) => (timeStart >= 1 ? timeStart - 1 : 0));
  };

  useEffect(() => {
    if (isTimerStart) {
      const interval = window.setInterval(() => timer(), 1000);

      return () => clearInterval(interval);
    }
  });

  useEffect(() => {
    !timeStart ? dispatch(startGame({ dataBox: words })) : null;
  }, [timeStart]);

  useEffect(() => {
    const url = window.location.href;
    const queries = url.slice(-5).match(/\d+/gi) || [];
    if (queries.length) {
      groupBlock.current.disabled = true;
      pageBlock.current.disabled = true;
      const [group, page] = queries;
      setGroup(group);
      setPage(page);
      getAggregatedWords({
        userId,
        params: {
          group: +group,
          page: +page,
          wordsPerPage: 20,
        },
      });
      dispatch(settingsUp({ page: +page, group: +group }));
      groupBlock.current.disabled = true;
      pageBlock.current.disabled = true;
    }
  }, []);

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

  function changeSelect(flag: boolean) {
    if (flag) {
      setGroup((event.target as HTMLSelectElement).value);
    } else {
      setPage((event.target as HTMLSelectElement).value);
    }
    dispatch(settingsUp({ page: +pageValue, group: +groupValue }));
  }

  return (
    <div className="start-screen">
      <div onClick={() => navigate("/main")} className="start-screen__close">
        <CloseBtnComponent />
      </div>
      <div className="start-screen__row">
        <div className="start-screen__row-text">
          <h1 className="start-screen__row-title">
            {gameName.toUpperCase()}:{`  Let's Catch`}
          </h1>
          <p>
            Tired of studying the textbook? Make learning more fun by testing
            your skills in interesting games.
          </p>
        </div>
        {!isTimerStart ? (
          <>
            <div className="start-screen__row-action">
              <div onClick={() => dispatch(timerUp())} className="row-counter">
                <p>GO!</p>
              </div>
            </div>
            <div className="start-screen__row-form">
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
            </div>
          </>
        ) : (
          <>
            <div className="start-screen__row-action">
              <div
                onClick={() => {
                  console.log(paused);
                  setPaused(!paused);
                }}
                className="row-counter"
              >
                <p>{paused ? "Paused" : timeStart}</p>
              </div>
            </div>
            <div className="start-screen__row-form">
              <form className="settings-form">
                <label htmlFor="gamelevel">level</label>
                <select
                  disabled
                  value={groupValue}
                  id="gamelevel"
                  name="unittype"
                  required
                >
                  <OptionsComponent counter={maxGroup} />
                </select>
                <label htmlFor="gamepage">page</label>
                <select
                  disabled
                  value={pageValue}
                  id="gamepage"
                  name="type"
                  required
                >
                  <OptionsComponent counter={maxPage} />
                </select>
              </form>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
export default GameStartScreen;
