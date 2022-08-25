import React from "react";
import Icon from "../../../../components/icon/icon";
import "./popUp.scss";
import { API_BASE_URL } from "../../../../config";
import { IPopUp } from "../../../../interfaces/popUp";

function PopUp({ info, togglePopup, clickNext, number, clickExit }: IPopUp) {
  const condition = Boolean(number != 19);
  return (
    <>
      <div onClick={togglePopup} className="popup">
        <div className="popup__sound"></div>
        <div className="popup__container">
          <div className="popup__center">
            <div className="popup__column-left">
              <div className="popup__titles">
                <div className="popup__word-en">{info.word}</div>
                <div className="popup__word-transq">{info.transcription}</div>
                <div className="popup__word-ru">{info.wordTranslate}</div>
              </div>
              <div className="popup__titles-footer">
                <div className="popup__text">{info.textMeaning}</div>
              </div>
            </div>
            <div className="popup__column-rigth">
              <img
                className="popup__img"
                src={API_BASE_URL + "/" + info.image}
                alt="img"
              />
            </div>
          </div>
          <div className="popup__footer">
            <div className="popup__text">{info.textExample}</div>
            <div className="popup__text">{info.textExampleTranslate}</div>
          </div>
        </div>
      </div>

      <div className="popup__buttons">
        <div
          onClick={() => {
            if (condition) clickNext();
          }}
          className={
            "popup__button popup__button-next" + condition ? "" : "disabled"
          }
        >
          Cледующая
        </div>
        <div
          onClick={clickExit}
          className="popup__button popup__button-unknown"
        >
          Не знаю
        </div>
        <div className="popup__button popup__button-known">Изучил</div>
        <div className="popup__button popup__button-hard">Сложно</div>
      </div>

      <></>
    </>
  );
}

export default PopUp;
