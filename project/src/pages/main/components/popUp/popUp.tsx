import React, { MouseEventHandler, SyntheticEvent, useState } from "react";
import Icon from "../../../../components/icon/icon";
import "./popup.scss";
import { IWord } from "../../../../interfaces/word";
import { API_BASE_URL } from "../../../../config";
import { IPopUp } from "../../../../interfaces/popUp";

function PopUp({ info, togglePopup }: IPopUp) {
  return (
    <>
      <div onClick={togglePopup} className="popup">
        <div className="popup__flex">
          <img
            className="popup__img"
            src={API_BASE_URL + "/" + info.image}
            alt="img"
          />
          <div className="popup__center">
            <div className="popup__word">
              <div className="popup__word-en">{info.word}</div>
              <>
                <div className="popup__word-transq">{info.transcription}</div>
                <div className="popup__word-ru">{info.wordTranslate}</div>
              </>
            </div>
            <div className="popup__text">{info.textMeaning}</div>
            <>
              <div className="popup__text">{info.textMeaningTranslate}</div>
              <div className="popup__text">{info.textExample}</div>
              <div className="popup__text">{info.textExampleTranslate}</div>
            </>
          </div>
          <div className="popup__controls">
            <a>
              <Icon url={API_BASE_URL + "/" + info.audio} type="sound" />
            </a>
            <a>
              <Icon url={API_BASE_URL + "/" + info.audioMeaning} type="info" />
            </a>
          </div>
        </div>
      </div>

      <div className="popup__buttons">
        <button className="button__next">Cледующая</button>
        <button className="button__unknown">Не знаю</button>
        <button className="button__known">Изучена</button>
        <button className="button__complicated">Сложно</button>
      </div>

      <></>
    </>
  );
}

export default PopUp;
