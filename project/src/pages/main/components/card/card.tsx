import React, { MouseEventHandler, SyntheticEvent, useState } from "react";
import Icon from "../../../../components/icon/icon";
import "./card.scss";
import { IWord } from "../../../../interfaces/word";
import { API_BASE_URL } from "../../../../config";
import { ICardProps } from "../../../../interfaces/cardProps";

function Card({ info, togglePopup }: ICardProps) {
  return (
    <>
      <div onClick={togglePopup} className="card">
        <div className="card__flex">
          <div className="card__img-container">
            <img
              className="card__img"
              src={API_BASE_URL + "/" + info.image}
              alt="img"
            />
            <div className="card__center">
              <div className="card__word">
                <div className="card__word-en">{info.word}</div>
              </div>
              <div className="card__text">{info.textMeaning}</div>
            </div>
          </div>
          <div className="card__controls">
            <a>
              <Icon url={API_BASE_URL + "/" + info.audio} type="sound" />
            </a>
            <a>
              <Icon url={API_BASE_URL + "/" + info.audioMeaning} type="info" />
            </a>
          </div>
        </div>
      </div>

      <></>
    </>
  );
}

export default Card;
