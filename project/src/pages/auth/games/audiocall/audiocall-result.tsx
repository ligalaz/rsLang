import React from "react";
import { useDispatch } from "react-redux";
import { IWord } from "../../../../interfaces/word";
import { settingsDown } from "../../../../store/audiocall-settings-slice";
import { resetGame, restartGame } from "../../../../store/audiocall-slice";
import { AppDispatch } from "../../../../store/store";
import AudioCallRepeater from "./audiocall-repeater";
import "./audiocall-result.scss";

const AudiocallResult = () => {
  const dispatch: AppDispatch = useDispatch();
  return (
    <div className="audiocall__modal">
      <div className="audiocall__modal-row">
        <div className="audiocall__modal-row-title">
          <h2>{`I don't know :(`}</h2>
          <hr />
        </div>
        <div className="audiocall__modal-row-table">
          <table>
            <thead>
              {(
                JSON.parse(localStorage.getItem("falseAnswers")) as IWord[]
              ).map((word) => (
                <tr key={word.id + Math.random()}>
                  <td valign="middle">
                    <AudioCallRepeater
                      style={{ height: `50px` }}
                      className="word-repeater repeater-mini"
                      isCall={true}
                      current={word}
                    />
                  </td>
                  <td valign="middle">{word.word}</td>
                  <td valign="middle">{word.transcription}</td>
                  <td valign="middle">{word.wordTranslate}</td>
                </tr>
              ))}
            </thead>
          </table>
        </div>
      </div>
      <div className="audiocall__modal-btns">
        <button
          onClick={() => {
            dispatch(restartGame());
          }}
          className="modal__orange-btn"
        >
          Restart
        </button>
        <button className="modal__blue-btn">Statistic</button>
        <button
          onClick={() => {
            dispatch(settingsDown());
            dispatch(resetGame());
          }}
          className="modal__blue-btn"
        >
          New Game
        </button>
      </div>
    </div>
  );
};

export default AudiocallResult;
