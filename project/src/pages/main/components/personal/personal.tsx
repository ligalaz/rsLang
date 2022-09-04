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
import { Statistic } from "../../../../interfaces/statistic";
import { getStartOfDayDate } from "../../../../utils/get-start-of-day-date";
import { Word } from "../../../../interfaces/word";

interface ITextbookRouteParams {
  page?: string;
  group: string;
}

function Personal() {
  const auth: IAuth = useAppSelector(
    (state: RootState) => state.authState?.auth
  );

  const statistics: Statistic = useAppSelector(
    (state: RootState) => state.statisticsState?.statistics
  );
  const location = useLocation();
  const [routeParams, setRouteParams] = useState<ITextbookRouteParams>(null);

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
    if (location.pathname.includes("textbook")) {
      const pathes: string[] = location.pathname.split("/");
      const params: ITextbookRouteParams = {
        group: pathes[3],
      };
      if (pathes.length === 5) {
        params.page = pathes[4];
      }
      setRouteParams(params);
    }
  }, [location.pathname]);

  useEffect(() => {
    if (auth) {
      getUserStatistics(auth.userId);
      getNewUserWords(auth.userId);
    }
  }, []);

  return (
    <>
      <div className="personal">
        <div className="personal__wrapper">
          <div className="personal__upper">
            <div className="personal__info">
              <Icon type="icon" />
            </div>
            <div className="personal__title">{auth?.name ?? "Student1"}</div>
          </div>
          {auth && (
            <div className="personal__center">
              <div className="personal__center-title">Daily statistics</div>
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
                    {statistics?.optional?.audioCall?.maxSeria ?? 0}
                  </div>
                  <div className="personal__percent">
                    {statistics?.audioCallPercent || 0}%
                  </div>
                  <div className="presonal__all">{audioWords.length}</div>
                </div>

                <div className="personal__column personal__column-info">
                  <div className="personal__game-title">Sprint</div>
                  <div className="personal__strick">
                    {statistics?.optional?.sprint?.maxSeria ?? 0}
                  </div>

                  <div className="personal__percent">
                    {statistics?.sprintPercent || 0}%
                  </div>
                  <div className="personal__all">{sprintWords.length}</div>
                </div>
              </div>
              <div className="personal__statistics">
                <div className="personal__statistics-descr">
                  <div className="personal__statistics-learned">Learnt</div>
                  <div className="personal__statistics-percentage">
                    Accuracy
                  </div>
                  <div className="personal__statistics-all">new words</div>
                </div>

                <div className="personal__statistics-descr personal__statistics-descr2">
                  <div className="personal__statistics-learned">
                    {learnedWords.length}
                  </div>
                  <div className="personal__statistics-percentage">
                    {statistics?.gamesPercent || 0}%
                  </div>
                  <div className="personal__statistics-all">{words.length}</div>
                </div>
              </div>
            </div>
          )}
          <div className="personal__progress">
            <div className="personal__success">Progress</div>
            <div className="personal__diagram">
              <CircularProgressbar
                value={statistics?.learnPercent || 0}
                text={`${statistics?.learnPercent || 0}%`}
              />
            </div>
            {routeParams && (
              <div className="personal__buttons">
                <Link
                  style={{ textDecoration: "none" }}
                  to={
                    routeParams.page
                      ? `/sprint?group=${routeParams.group}&page=${routeParams.page}`
                      : `/sprint?group=${routeParams.group}`
                  }
                  className="personal__game personal__game1"
                  type="button"
                >
                  Sprint
                </Link>

                <Link
                  style={{ textDecoration: "none" }}
                  to={
                    routeParams.page
                      ? `/audiocall?group=${routeParams.group}&page=${routeParams.page}`
                      : `/audiocall?group=${routeParams.group}`
                  }
                  className="personal__game personal__game2"
                  type="button"
                >
                  Audio call
                </Link>
                <Link
                  style={{ textDecoration: "none" }}
                  to={
                    routeParams.page
                      ? `/savanna?group=${routeParams.group}&page=${routeParams.page}`
                      : `/savanna?group=${routeParams.group}`
                  }
                  className="personal__game personal__game2"
                  type="button"
                >
                  Savanna
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default Personal;
