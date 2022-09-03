import "./tablet-stat.scss";
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
import { Statistic } from "../../../../interfaces/statistic";
import { getStartOfDayDate } from "../../../../utils/get-start-of-day-date";
import { Word } from "../../../../interfaces/word";

function TabletStat() {
  const auth: IAuth = useAppSelector(
    (state: RootState) => state.authState?.auth
  );

  const statistics: Statistic = useAppSelector(
    (state: RootState) => state.statisticsState?.statistics
  );
  const location = useLocation();
  const [isTextbookRoute, setRoute] = useState<boolean>(
    location.pathname.includes("textbook")
  );

  const words: Word[] = useAppSelector(
    (state: RootState) => state.statisticsState?.newWords || []
  );
  const today = getStartOfDayDate();
  const audioWords = words.filter((a: Word) => a.userWord?.optional?.audioCall);
  const sprintWords = words.filter((a: Word) => a.userWord?.optional?.sprint);
  const learnedWords = words.filter(
    (a: Word) => a.userWord?.optional?.learnedDate === today
  );
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
    <>
      <div className="tabletstat">
        <div className="tabletstat__wrapper">
          <div className="tabletstat__upper">
            <div className="tabletstat__info">
              <Icon type="icon" />
            </div>
            <div className="tabletstat__title">{auth?.name ?? "Student1"}</div>
          </div>

          <div className="tabletstat__center">
            <div className="tabletstat__center-title">Daily statistics</div>
            <div className="tabletstat__center-content">
              <div className="tabletstat__games">
                <div className="tabletstat__column">
                  <div className="tabletstat__game-hidden">game</div>
                  <div className="tabletstat__descr">In a row</div>
                  <div className="tabletstat__descr">accuracy</div>
                  <div className="tabletstat__descr">New words</div>
                </div>

                <div className="tabletstat__column tabletstat__column-info">
                  <div className="tabletstat__game-title">AudioCall</div>
                  <div className="tabletstat__strick">
                    {statistics?.optional?.audioCall?.maxSeria ?? 0}
                  </div>
                  <div className="tabletstat__percent">
                    {statistics?.audioCallPercent || 0}%
                  </div>
                  <div className="presonal__all">{audioWords.length}</div>
                </div>

                <div className="tabletstat__column tabletstat__column-info">
                  <div className="tabletstat__game-title">Sprint</div>
                  <div className="tabletstat__strick">
                    {statistics?.optional?.sprint?.maxSeria ?? 0}
                  </div>

                  <div className="tabletstat__percent">
                    {statistics?.sprintPercent || 0}%
                  </div>
                  <div className="tabletstat__all">{sprintWords.length}</div>
                </div>
              </div>
              <div className="tabletstat__statistics">
                <div className="tabletstat__statistics-descr">
                  <div className="tabletstat__game-hidden">game</div>
                  <div className="tabletstat__statistics-learned">Learnt</div>
                  <div className="tabletstat__statistics-percentage">
                    Accuracy
                  </div>
                  <div className="tabletstat__statistics-all">New words</div>
                </div>

                <div className="tabletstat__statistics-descr tabletstat__statistics-descr2">
                  <div className="tabletstat__game-hidden">game</div>
                  <div className="tabletstat__statistics-learned">
                    {learnedWords.length}
                  </div>
                  <div className="tabletstat__statistics-percentage">
                    {statistics?.gamesPercent || 0}%
                  </div>
                  <div className="tabletstat__statistics-all">
                    {words.length}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="tabletstat__progress">
            <div className="tabletstat__success">Progress</div>
            <div className="tabletstat__diagram">
              <CircularProgressbar
                value={statistics?.learnPercent || 0}
                text={`${statistics?.learnPercent || 0}%`}
              />
            </div>
            {isTextbookRoute && (
              <div className="personal__buttons">
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
      </div>
    </>
  );
}

export default TabletStat;
