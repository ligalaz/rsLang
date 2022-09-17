import React, { useEffect, useRef, useState, ChangeEvent } from "react";
import { useNavigate } from "react-router";
import CloseBtn from "../close-btn/close-btn";
import OptionsComponent from "../options/options-component";
import "./game-start-screen.scss";

interface GameStartScreenProps {
  onTimerStart: CallableFunction;
  onTimerFinish: CallableFunction;
  game: "savanna" | "sprint" | "audiocall";
  onPageSelect: (page: number) => void;
  onGroupSelect: (group: number) => void;
  page: number;
  group: number;
  mode: "textbook" | "main";
}

export function GameStartScreen({
  onTimerStart,
  onTimerFinish,
  game,
  onPageSelect,
  onGroupSelect,
  page,
  group,
  mode,
}: GameStartScreenProps) {
  const navigate = useNavigate();
  const [timer, setTimer] = useState(null);
  const timerRef = useRef<number>(null);

  useEffect(() => {
    if (timer) {
      timerRef.current = window.setTimeout(
        () => setTimer((prev: number) => prev - 1),
        1000
      );
      return () => clearTimeout(timerRef.current);
    } else if (timerRef.current) {
      onTimerFinish();
    }
  }, [timer]);

  function start(): void {
    setTimer(5);
    onTimerStart();
  }

  function stop(): void {
    setTimer(null);
    clearTimeout(timerRef.current);
    timerRef.current = null;
  }

  function changeSelect(event: ChangeEvent): void {
    const target: HTMLSelectElement = event.target as HTMLSelectElement;
    switch (event.target.id) {
      case "gamelevel":
        onGroupSelect(parseInt(target.value));
        break;
      case "gamepage":
        onPageSelect(parseInt(target.value));
        break;
      default:
        break;
    }
  }

  return (
    <div className="start-screen">
      <div onClick={() => navigate("/main")} className="start-screen__close">
        <CloseBtn />
      </div>
      <div className="start-screen__wrapper">
        <div className="start-screen__row">
          <div className="start-screen__row-text">
            <h1 className="start-screen__row-title">
              {game.toUpperCase()}:{`  Let's Catch`}
            </h1>
            <p>
              Tired of studying the textbook? Make learning more fun by testing
              your skills in interesting games.
            </p>
            {mode === "main" && (
              <div className="start-screen__row-form">
                <form className="settings-form">
                  <label htmlFor="gamelevel" className="settings-form__label">
                    level
                  </label>
                  <select
                    className={`settings-form__selection ${
                      timer && "settings-form__selection--disabled"
                    }`}
                    disabled={timer && true}
                    value={group ?? 0}
                    onChange={changeSelect}
                    id="gamelevel"
                    required
                  >
                    <OptionsComponent counter={6} />
                  </select>
                  {game === "audiocall" && (
                    <>
                      <label
                        htmlFor="gamepage"
                        className="settings-form__label"
                      >
                        page
                      </label>
                      <select
                        className={`settings-form__selection ${
                          timer && "settings-form__selection--disabled"
                        }`}
                        disabled={timer && true}
                        value={page ?? 0}
                        onChange={changeSelect}
                        id="gamepage"
                        required
                      >
                        <OptionsComponent counter={30} />
                      </select>
                    </>
                  )}
                </form>
              </div>
            )}
          </div>
          <div className="start-screen__row-action">
            <div
              onClick={() => (timerRef.current ? stop() : start())}
              className="row-counter"
            >
              <p>{timer ?? "GO!"}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
