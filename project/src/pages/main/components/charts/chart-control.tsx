import React, { useEffect } from "react";
import Icon from "../../../../components/icon/icon";
import { IAuth } from "../../../../interfaces/auth";
import { useGetUserWordsMutation } from "../../../../services/aggregated-words-service";

import { RootState, useAppSelector } from "../../../../store/store";
import { createDate } from "../../../../utils/data-parse";
import ChartComponent, {
  IChartValues,
} from "./charts-component/chart-component";

import "./chart.scss";

type resultOptions = {
  [key: string]: number;
};

const ChartControl = () => {
  const auth: IAuth = useAppSelector(
    (state: RootState) => state.authState?.auth
  );
  const words = useAppSelector(
    (state: RootState) => state.wordsState.words || []
  );
  const [getUserWords, { isLoading }] = useGetUserWordsMutation();
  const userId = auth?.userId;

  useEffect(() => {
    if (auth) {
      getUserWords({
        userId,
        params: {
          filter: `{"$or":[{"userWord.optional.learnedDate": { "$exists": true }},{"userWord.optional.firstSeenDate": { "$exists": true }}]}`,
          wordsPerPage: 3600,
        },
      });
    }
  }, []);

  const newWords = words
    ? words
        .filter((word) => word.userWord?.optional?.firstSeenDate !== undefined)
        .map((word) => word.userWord?.optional?.firstSeenDate)
        .sort()
    : [];

  const learned = words
    ? words
        .filter((word) => word.userWord?.difficulty === `learned`)
        .map((word) => word.userWord?.optional?.learnedDate)
        .sort()
    : [];

  const wordResult: resultOptions =
    newWords !== null
      ? newWords.reduce(function (acc: resultOptions, el: string) {
          acc[el] = (acc[el] || 0) + 1;
          return acc;
        }, {})
      : {};
  const learnedResult: resultOptions =
    learned !== null
      ? learned.reduce(function (acc: resultOptions, el: string) {
          acc[el] = (acc[el] || 0) + 1;
          return acc;
        }, {})
      : {};

  const wordTimestamp = Object.keys(wordResult).sort();

  const wordData = Object.values(wordResult);
  const learnedTimestamp = Object.keys(learnedResult);
  const learnedData = Object.values(learnedResult).map((item, idx, arr) =>
    idx - 1 >= 0 ? (item += arr[idx - 1]) : item
  );

  const newWordsData: IChartValues[] = [];
  const learnedWordsData: IChartValues[] = [];

  wordTimestamp.forEach((item, idx) => {
    newWordsData.push({
      timestamp: createDate(item),
      data: wordData[idx],
    });
  });
  learnedTimestamp.forEach((item, idx) => {
    learnedWordsData.push({
      timestamp: createDate(item),
      data: learnedData[idx],
    });
  });

  return (
    <div>
      <div className="page">
        <div className="page__descr">Statistic</div>
        <div className="page__line"></div>
      </div>
      {isLoading ? (
        <div className="textbook__loading">
          <Icon type="loading" />
        </div>
      ) : wordTimestamp.length < 2 && learnedTimestamp.length < 2 ? (
        <div className="charts">
          <div className="charts-container">
            <div className="charts-item">
              <p className="charts-item__text">
                {newWords.length
                  ? `Your data isn't enough to see new words chart per day. Please, make more activities in our application. At moment you have ${newWords.length} new words. `
                  : `Your data isn't enough to see new words chart per day. Please, make more activities in our application. `}
              </p>
            </div>
          </div>
          <div className="charts-container">
            <div className="charts-item">
              <p className="charts-item__text">
                {learned.length
                  ? `Your data isn't enough to see learned words chart per day. Please, make more activities in our application. At moment you have ${learned.length} learned words. `
                  : `Your data isn't enough to see learned words chart per day. Please, make more activities in our application. `}
              </p>
            </div>
          </div>
          <p className="charts-free__item charts-item__text">
            To display charts of long-term statistics, you need to log into the
            application for several days or use the default user when
            authorizing: <i>Login: a@a.com, password: 11111111</i>
          </p>
        </div>
      ) : (
        <>
          <ChartComponent
            name="New Words"
            color="#6550de"
            data={newWordsData}
          />
          <ChartComponent
            name="Learned Words"
            color="#FEC246"
            data={learnedWordsData}
          />
        </>
      )}
    </div>
  );
};

export default ChartControl;
