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
import { useActions } from "../../../../hooks/actions";
import SelectionOfParameters from "../components/selection-of-parameters/selection-of-parameters";
import CloseBtn from "../components/close-btn/close-btn";

import "./game-start-screen.scss";

const SELECTION_DATA = {
  label: "level",
  optionCount: 6,
};

export interface IStartScreenProps {
  gameName?: "sprint" | "audiocall";
  words?: IWord[];
}

const SprintGameStartScreen = ({ gameName, words }: IStartScreenProps) => {
  const { startGame, timerUp, settingsDown } = useActions();
  const auth: IAuth = useAppSelector(
    (state: RootState) => state.authState?.auth
  );

  const userId = auth?.userId;

  const dispatch: AppDispatch = useDispatch();
  const navigate = useNavigate();
  const { group, isTimerStart } = useAppSelector(
    (state: RootState) => state.sprintSettingsState,
    shallowEqual
  );

  const [timeStart, setTimeStart] = useState(5);
  const [paused, setPaused] = useState(false);
  const [groupValue, setGroupValue] = useState(String(group));

  const [getWords, { isLoading }] = useGetWordsMutation();
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
    !timeStart && !isLoading ? startGame(words) : null;
  }, [timeStart]);

  /*useEffect(() => {
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
          wordsPerPage: 20,
        },
      });
      dispatch(settingsUp({ page: +page, group: +group }));
      groupBlock.current.disabled = true;
      pageBlock.current.disabled = true;
    }
  }, []);*/

  useEffect(() => {
    if (auth?.userId) {
      getAggregatedWords({
        userId,
        params: {
          group: +groupValue,
          wordsPerPage: 600,
        },
      });
      getUserStatistics(auth.userId);
    } else {
      getWords({
        group: +groupValue,
        wordsPerPage: 600,
      });
    }
  }, [groupValue]);

  return (
    <div className="sprint-start-screen">
      <CloseBtn className="sprint-start-screen__circle" />
      <div className="sprint-start-screen__row">
        <div className="sprint-start-screen__row-text">
          <h1 className="sprint-start-screen__row-title">
            {gameName.toUpperCase()}:{`  Let's Catch`}
          </h1>
          <p>
            Tired of studying the textbook? Make learning more fun by testing
            your skills in interesting games.
          </p>
          <div className="sprint-start-screen__row-form">
            <form className="settings-form">
              <SelectionOfParameters
                selectionDetails={SELECTION_DATA}
                isDisabled={isTimerStart}
                value={groupValue}
                setValue={setGroupValue}
              />
            </form>
          </div>
        </div>
        <div
          onClick={() =>
            isTimerStart ? setPaused(!paused) : dispatch(timerUp())
          }
          className={`go-btn ${isTimerStart && "counter"}`}
        >
          {isTimerStart ? (
            <div>{paused ? "Paused" : timeStart}</div>
          ) : (
            <div>GO!</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SprintGameStartScreen;
