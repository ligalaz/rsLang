import React from "react";
import Icon from "../../../../components/icon/icon";
import "./popUp.scss";
import { API_BASE_URL } from "../../../../config";
import { IPopUp } from "../../../../interfaces/popUp";

function PopUp({ info, togglePopup, clickPage, number }: IPopUp) {
  const condition = Boolean(number != 19);
  return (
    <>
      <div onClick={togglePopup} className="popup">
        <div className="popup__sound">
          <Icon
            type="sound"
            url={API_BASE_URL + "/" + info.audio}
            audioExample={API_BASE_URL + "/" + info.audioMeaning}
            audioMeaning={API_BASE_URL + "/" + info.audioExample}
          />
        </div>
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
          <div className="popup__line"></div>
          <div className="popup__text">{info.textMeaningTranslate}</div>
          <div className="popup__footer">
            <div className="popup__text">{info.textExample}</div>
            <div className="popup__text">{info.textExampleTranslate}</div>
          </div>
        </div>
      </div>

      <div className="popup__buttons">
        <div
          onClick={() => {
            if (number) clickPage(-1);
          }}
          className={
            number
              ? "popup__button popup__button-prev"
              : " popup__button popup__button-prev disabled"
          }
        >
          Предыдущая
        </div>

        <div className="popup__button popup__button-known">Изучил</div>
        <div className="popup__button popup__button-hard">Сложно</div>
        <div
          onClick={() => {
            if (condition) clickPage(1);
          }}
          className={
            condition
              ? "popup__button popup__button-next"
              : " popup__button popup__button-next disabled"
          }
        >
          Cледующая
        </div>
      </div>

      <></>
    </>
  );
}

export default PopUp;
