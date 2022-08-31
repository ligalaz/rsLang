import "./personal.scss";
import React, { useState, useEffect } from "react";
import Icon from "../../../../components/icon/icon";
import { RootState, useAppSelector } from "../../../../store/store";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { Link, useLocation } from "react-router-dom";
import {
  useGetNewUserWordsMutation,
  useGetUserStatisticsMutation,
} from "../../../../services/statistics-service";
import { IAuth } from "../../../../interfaces/auth";
import { IStatistic } from "../../../../interfaces/statistic";
import { getStartOfDayDate } from "../../../../utils/get-start-of-day-date";
import { Word } from "../../../../interfaces/word";

function Personal() {
  const auth: IAuth = useAppSelector(
    (state: RootState) => state.authState?.auth
  );

  const statistics: IStatistic = useAppSelector(
    (state: RootState) => state.statisticsState?.statistics
  );
  const location = useLocation();
  const [isTextbookRoute, setRoute] = useState<boolean>(
    location.pathname.includes("textbook")
  );

  const words: Word[] = useAppSelector(
    (state: RootState) => state.statisticsState?.newWords || []
  );

  const audioWords = words.filter((a: Word) => a.userWord?.optional?.audioCall);
  const sprintWords = words.filter((a: Word) => a.userWord?.optional?.sprint);
  console.log(audioWords);

  const [getNewUserWords] = useGetNewUserWordsMutation();
  const [getUserStatistics] = useGetUserStatisticsMutation();

  useEffect(() => {
    setRoute(location.pathname.includes("textbook"));
  }, [location.pathname]);

  useEffect(() => {
    if (auth) {
      getUserStatistics(auth.userId);
      getNewUserWords(auth.userId);
    }
  }, []);

  return (
    <div className="personal">
      <div className="personal__wrapper">
        <div className="personal__upper">
          <Icon type="icon" />
        </div>
        <div className="personal__title">{auth?.name ?? "Student1"}</div>
        {auth && (
          <div className="personal__games">
            <div className="personal__column">
              <div className="personal__game-hidden">game</div>
              <div className="personal__descr">In a row</div>
              <div className="personal__descr">accuracy</div>
              <div className="personal__descr">New words</div>
            </div>

            <div className="personal__column personal__column-info">
              <div className="personal__game-title">AudioCall</div>
              <div className="personal__strick">
                {statistics?.optional?.audioCall?.seria ?? 0}
              </div>
              <div className="personal__percent">
                {statistics?.optional?.audioCall?.[getStartOfDayDate()]?.guesses
                  ? Math.round(
                      (statistics?.optional?.audioCall?.[getStartOfDayDate()]
                        ?.guesses /
                        statistics?.optional?.audioCall?.[getStartOfDayDate()]
                          ?.attempts) *
                        100
                    ) + "%"
                  : "0%"}
              </div>
              <div className="presonal__all"></div>
            </div>

            <div className="personal__column personal__column-info">
              <div className="personal__game-title">Sprint</div>
              <div className="personal__strick">
                {statistics?.optional?.sprint?.seria ?? 0}
              </div>

              <div className="personal__percent">
                {statistics?.optional?.sprint?.[getStartOfDayDate()]?.guesses
                  ? Math.round(
                      (statistics?.optional?.sprint?.[getStartOfDayDate()]
                        ?.guesses /
                        statistics?.optional?.sprint?.[getStartOfDayDate()]
                          ?.attempts) *
                        100
                    ) + "%"
                  : "0%"}
              </div>
              <div className="personal__all"></div>
            </div>
          </div>
        )}
        <div className="personal__progress">
          <div className="personal__success">Progress</div>
        </div>
        <div className="personal__diagram">
          <CircularProgressbar
            value={
              statistics?.learnedWords
                ? Math.ceil((statistics?.learnedWords / 3600) * 100)
                : 0
            }
            text={`${
              statistics?.learnedWords
                ? Math.ceil((statistics?.learnedWords / 3600) * 100)
                : 0
            }%`}
          />
        </div>
        {isTextbookRoute && (
          <div className="personal__games">
            <Link
              style={{ textDecoration: "none" }}
              to="/registration"
              className="personal__game personal__game1"
              type="button"
            >
              Sprint
            </Link>

            <Link
              style={{ textDecoration: "none" }}
              to="/registration"
              className="personal__game personal__game2"
              type="button"
            >
              Audio call
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

export default Personal;
