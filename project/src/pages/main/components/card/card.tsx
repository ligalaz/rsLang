import React from "react";
import Icon from "../../../../components/icon/icon";
import "./card.scss";
import { IWord } from "../../../../interfaces/word";

interface Icard {
  info: IWord;
  key: string;
}

function Card({ info, key }: Icard) {
  return (
    <div className="card">
      <div className="card__flex">
        <img className="card__img" src={info.image} alt="img" />
        <div className="card__center">
          <div className="card__word">
            <div className="card__word-en">{info.word}</div>
            <div className="card__word-transq">{info.transcription}</div>
            <div className="card__word-ru">{info.wordTranslate}</div>
          </div>
          <div className="card__text">{info.textExample}</div>
          <div className="card__text">{info.textMeaning}</div>
        </div>
        <div className="card__controls">
          <a>
            <Icon type="sound" />
          </a>
          <a>
            <Icon type="info" />
          </a>
        </div>
      </div>
    </div>
  );
}

export default Card;
