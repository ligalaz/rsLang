import React, { useEffect } from "react";
import { IAuth } from "../../../../interfaces/auth";
import { Statistic } from "../../../../interfaces/statistic";
import { useGetNewUserWordsMutation } from "../../../../services/statistics-service";
import { RootState, useAppSelector } from "../../../../store/store";
import { createDate } from "../../../../utils/data-parse";
import ChartComponent, {
  IChartValues,
} from "./charts-component/chart-component";

const ChartControl = () => {
  const auth: IAuth = useAppSelector(
    (state: RootState) => state.authState?.auth
  );

  const statistics: Statistic = useAppSelector(
    (state: RootState) => state.statisticsState.statistics
  );

  const words = useAppSelector((state: RootState) => state.wordsState.words);
  console.log(words);

  const userId = auth?.userId;

  const [getUserStatistics] = useGetNewUserWordsMutation();
  const [getNewUserWords] = useGetNewUserWordsMutation();

  useEffect(() => {
    if (auth) {
      getUserStatistics(userId);
      getNewUserWords(userId);
    }
  }, []);

  const timestamps = [
    16622034500, 16822898500, 17023762500, 17324626500, 17525490500,
    17926354500, 18527218500, 18628082500, 18828946500,
  ];

  const allWordsForPeriod = [10, 20, 30, 35, 37, 40, 60, 75, 90];
  const newWordsPerDay = [10, 5, 15, 4, 10, 50, 16, 17, 10];

  const newWordsData: IChartValues[] = [];
  const allWordsData: IChartValues[] = [];

  timestamps.forEach((item, idx) => {
    newWordsData.push({
      timestamp: createDate(item),
      data: newWordsPerDay[idx],
    });
    allWordsData.push({
      timestamp: createDate(item),
      data: allWordsForPeriod[idx],
    });
  });

  return (
    <div>
      <h1 style={{ textAlign: `center` }}>Long term statistics </h1>
      <ChartComponent color="#f56748" name="New Words" data={newWordsData} />
      <ChartComponent color="#6550de" name="All Words" data={allWordsData} />
    </div>
  );
};

export default ChartControl;
