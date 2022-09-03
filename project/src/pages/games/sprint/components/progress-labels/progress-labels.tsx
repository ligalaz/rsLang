import React, { useState, useEffect } from "react";
import { useAppSelector } from "../../../../../store/store";
import "./progress-labels.scss";

const ProgressLabels = () => {
  const { trueAnswersCount } = useAppSelector((state) => state.sprintState);

  const ProgressItemsBreakpoints = [
    [1, 4, 7],
    [2, 5, 8],
    [3, 6, 9],
  ];
  const progressBreakpoints = [4, 7, 10, 13];
  const initProgress = new Array(ProgressItemsBreakpoints.length).fill(false);
  const [progress, setProgress] = useState(initProgress);

  useEffect(() => {
    const activeProgressItemNumber = ProgressItemsBreakpoints.findIndex(
      (ProgressItemBreakpoint) =>
        ProgressItemBreakpoint.includes(trueAnswersCount)
    );

    const currentProgress =
      progressBreakpoints.includes(trueAnswersCount) || !trueAnswersCount
        ? initProgress
        : progress;
    setProgress(
      currentProgress.map((currentProgressItem, index) =>
        index === activeProgressItemNumber ? true : currentProgressItem
      )
    );

    if (trueAnswersCount >= 10) {
      setProgress(progress.slice(0, 1));
    }
  }, [trueAnswersCount]);

  return (
    <div className="progress">
      {progress.map((item, index) => (
        <div
          key={`indicator ${index}`}
          className={`progress__item ${item && "progress__item--active"}`}
        />
      ))}
    </div>
  );
};

export default ProgressLabels;
