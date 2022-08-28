import React from "react";
import Timer from "../timer/timer";

const timerDetails = {
  delay: 1000,
  initial: 60,
  className: "sprint-timer",
};

const SprintGame = () => {
  return (
    <div className="container">
      <header className="header">
        <div className="close-btn"></div>
      </header>
      <main className="main">
        <section className="sprint-game">
          <div className="sprint-game__header">
            <span className="score"></span>
            <div></div>
          </div>
          <Timer timerDetails={timerDetails} />
          <div className="sprint-game__word">
            {}
            <span className="sprint-game__word-translation">{}</span>
          </div>
          <div>
            <button className="sprint-game__no-btn">неверно</button>
            <button className="sprint-game__yes-btn">верно</button>
          </div>
        </section>
      </main>
    </div>
  );
};

export default SprintGame;
