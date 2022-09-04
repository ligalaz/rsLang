import React, { useEffect, useState } from "react";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import "./timer.scss";

interface TimerDetails {
  delay: number;
  initial: number;
  timerCircle: number;
  className?: string;
  endTimer?: () => void;
}

const Timer = ({
  initial,
  delay,
  className,
  timerCircle,
  endTimer,
}: TimerDetails): JSX.Element => {
  const [timer, setTimer] = useState(initial);
  const [value, setValue] = useState(timerCircle);

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
