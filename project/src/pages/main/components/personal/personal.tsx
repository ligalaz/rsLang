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

export interface ITextbookRouteParams {
  page?: string;
  group?: string;
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
  const learnedWords = words.filter(
    (a: Word) => a.userWord?.optional?.learnedDate === today
  );
  const newWords = words.filter(
    (a: Word) => a.userWord?.optional?.firstSeenDate === today
  );
  const audioWords = newWords.filter(
    (a: Word) => a.userWord?.optional?.audioCall
  );
  const sprintWords = newWords.filter(
    (a: Word) => a.userWord?.optional?.sprint
  );
  const savannaWords = newWords.filter(
    (a: Word) => a.userWord?.optional?.savanna
  );

  const [getNewUserWords] = useGetNewUserWordsMutation();
  const [getUserStatistics] = useGetUserStatisticsMutation();

  useEffect(() => {
    if (location.pathname.includes("textbook")) {
      const [group, page]: string[] = location.pathname.split("/").slice(-2);
      setRouteParams({
        group,
        page,
      });
    } else {
      setRouteParams(null);
    }
  }, [location.pathname]);

  useEffect(() => {
    if (auth) {
      getUserStatistics(auth.userId);
      getNewUserWords(auth.userId);
    }
  }, []);

  const gameWords: Word[] = useAppSelector(
    (state: RootState) => state.wordsState.words || []
  );

  const isGameButtonsUnavailable =
    gameWords.every((word: Word) =>
      ["learned", "hard"].includes(word?.userWord?.difficulty)
    ) && gameWords.length !== 0;

  return (
    <>
      <div className="personal">
        <div className="page personal__page">
          <div className="page__descr">Personal</div>
          <div className="page__line"></div>
        </div>
        <div className="personal__wrapper">
          <div className="personal__upper">
            <div className="personal__info">
              {isGameButtonsUnavailable && routeParams ? (
                <div className="personal__logo-skilled" />
              ) : (
                <Icon type="icon" />
              )}
            </div>
            <div className="personal__title">{auth?.name ?? "Student1"}</div>
          </div>
          {auth && (
            <div className="personal__center">
              <div className="personal__center-content">
                <div className="personal__center-title">
                  Games daily statistics
                </div>
                <div className="personal__games">
                  <div className="personal__column">
                    <div className="personal__game-hidden">game</div>
                    <div className="personal__descr">In a row</div>
                    <div className="personal__descr">Accuracy</div>
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

                  <div className="personal__column personal__column-info">
                    <div className="personal__game-title">Savanna</div>
                    <div className="personal__strick">
                      {statistics?.optional?.savanna?.maxSeria ?? 0}
                    </div>

                    <div className="personal__percent">
                      {statistics?.savannaPercent || 0}%
                    </div>
                    <div className="personal__all">{savannaWords.length}</div>
                  </div>
                </div>
                <div className="personal__center-title">
                  Words daily statistics
                </div>
                <div className="personal__statistics">
                  <div className="personal__statistics-descr">
                    <div className="personal__statistics-learned">Learnt</div>
                    <div className="personal__statistics-percentage">
                      Accuracy
                    </div>
                    <div className="personal__statistics-all">New words</div>
                  </div>

                  <div className="personal__statistics-descr personal__statistics-descr2">
                    <div className="personal__statistics-learned">
                      {learnedWords.length}
                    </div>
                    <div className="personal__statistics-percentage">
                      {statistics?.gamesPercent || 0}%
                    </div>
                    <div className="personal__statistics-all">
                      {newWords.length}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          <div className="personal__progress">
            {auth && (
              <>
                <div className="personal__success">Progress</div>
                <div className="personal__diagram">
                  <CircularProgressbar
                    value={statistics?.learnPercent || 0}
                    text={`${statistics?.learnPercent || 0}%`}
                  />
                </div>
              </>
            )}
            {!isGameButtonsUnavailable && routeParams && (
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
                  className="personal__game personal__game3"
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
