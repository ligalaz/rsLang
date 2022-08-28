import React, { MouseEventHandler } from "react";
import Icon from "../../../../components/icon/icon";
import "./card.scss";
import { API_BASE_URL } from "../../../../config";
import { Word } from "../../../../interfaces/word";

export interface ICardProps {
  info: Word;
  togglePopup?: MouseEventHandler<HTMLElement>;
}

function Card({ info, togglePopup }: ICardProps) {
  return (
    <>
      <div
        className={`card ${
          info?.userWord?.difficulty === "hard"
            ? "hard"
            : info?.userWord?.difficulty === "normal"
            ? "normal"
            : ""
        }`}
      >
        <div className="card__flex">
          <div className="card__img-container">
            <img
              className="card__img"
              src={API_BASE_URL + "/" + info.image}
              alt="img"
            />
            <div className="card__center">
              <div className="card__word">{info.word}</div>
              <div
                className="card__text"
                dangerouslySetInnerHTML={{ __html: info.textMeaning }}
              ></div>
            </div>
          </div>
          <div className="card__controls">
            <a className="card__control-option">
              <Icon url={API_BASE_URL + "/" + info.audio} type="sound" />
            </a>
            <a className="card__control-option" onClick={togglePopup}>
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
