import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import CloseBtnComponent from "./close-btn-component";
import "./game-screen.scss";

export interface IStartScreenProps {
  gameName: "sprint" | "audiocall";
}

const GameStartScreen = (props: IStartScreenProps) => {
  const [timeStart, setTimeStart] = useState(5);
  const navigate = useNavigate();

  useEffect(() => {
    const interval = window.setInterval(() => {
      setTimeStart((timeStart: number) => (timeStart >= 1 ? timeStart - 1 : 0));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // if (timeStart === 0) {
  //   props.gameName === "sprint"
  //     ? navigate("/sprint", { replace: true })
  //     : navigate("/audiocall", { replace: true });
  // }

  return (
    <div className="start-screen">
      <div onClick={() => navigate("/main")} className="start-screen__close">
        <CloseBtnComponent />
      </div>
      <div className="start-screen__row">
        <div className="start-screen__row-text">
          <h1 className="start-screen__row-title">
            {props.gameName.toUpperCase()}:{`  Let's Catch`}
          </h1>
          <p>
            Tired of studying the textbook? Make learning more fun by testing
            your skills in interesting games.
          </p>
        </div>
        <div className="start-screen__row-counter">
          <p>{timeStart}</p>
        </div>
      </div>
    </div>
  );
};
export default GameStartScreen;
