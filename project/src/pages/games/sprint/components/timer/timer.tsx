import React, { useEffect, useState } from "react";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import "./timer.scss";

interface TimerDetails {
  timerDetails: {
    delay: number;
    initial: number;
    className: string;
  };
  endTimer?: () => void;
  isStarted: boolean;
}

const Timer = ({
  timerDetails,
  endTimer,
  isStarted,
}: TimerDetails): JSX.Element => {
  const { initial, delay, className } = timerDetails;
  const [timer, setTimer] = useState(initial);
  const [value, setValue] = useState(100);

  useEffect(() => {
    if (isStarted) {
      if (timer) {
        const timerId = setTimeout(() => {
          setTimer((current: number) => current - 1);
          setValue((current: number) => current - 1.68);
        }, delay);
        return () => clearTimeout(timerId);
      } else {
        endTimer();
      }
    }
  }, [timer, isStarted]);

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
