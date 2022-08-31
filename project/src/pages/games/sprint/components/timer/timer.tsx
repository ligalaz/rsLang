import React, { useEffect, useState } from "react";
import TimerDetails from "../../../../../interfaces/timer";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import "./timer.scss";

const Timer = ({ timerDetails, endTimer }: TimerDetails): JSX.Element => {
  const { initial, delay, className } = timerDetails;
  const [timer, setTimer] = useState(initial);
  const [value, setValue] = useState(100);

  useEffect(() => {
    if (timer) {
      const timerId = setTimeout(() => {
        setTimer((current: number) => current - 1);
        setValue((current: number) => current - 1.68);
      }, delay);
      return () => clearTimeout(timerId);
    } else {
      endTimer();
    }
  }, [timer]);

  return (
    <CircularProgressbar
      value={value}
      text={`${timer}`}
      counterClockwise={true}
      className={className}
    />
  );
};

export default Timer;
