import React, { useEffect, useState } from "react";
import { useActions } from "../../../../../hooks/actions";
import TimerDetails from "../../../../../interfaces/timer";

const Timer = ({ timerDetails }: { timerDetails: TimerDetails }) => {
  const { initial, delay, className } = timerDetails;
  const { isResultsShown } = useActions();
  const [timer, setTimer] = useState(initial);

  useEffect(() => {
    if (timer) {
      const timerId = setTimeout(() => {
        setTimer((current: number) => current - 1);
      }, delay);
      return () => clearTimeout(timerId);
    } else {
      isResultsShown();
    }
  });

  return <div className={`timer ${className}`}>{timer}</div>;
};

export default Timer;
