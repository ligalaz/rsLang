import React, { MouseEventHandler } from "react";
import Icon from "../../../../components/icon/icon";
import "./card.scss";
import { API_BASE_URL } from "../../../../config";
import { Word } from "../../../../interfaces/word";
import classNames from "classnames";
import { getStartOfDayDate } from "../../../../utils/get-start-of-day-date";

export interface ICardProps {
  info: Word;
  togglePopup?: MouseEventHandler<HTMLElement>;
  removeWord?: MouseEventHandler<HTMLElement>;
  isAuth: boolean;
  group: number;
}

function Card({ info, togglePopup, removeWord, isAuth, group }: ICardProps) {
  return (
    <div
      className={classNames("card", {
        card_hard: info?.userWord?.difficulty === "hard",
        card_learned: info?.userWord?.difficulty === "learned",
        card_seen:
          info?.userWord?.difficulty === "seen" &&
          info?.userWord?.optional?.firstSeenDate !== getStartOfDayDate(),
        card_new:
          info?.userWord?.difficulty === "seen" &&
          info?.userWord?.optional?.firstSeenDate === getStartOfDayDate(),
        "card_no-badge": !isAuth || (!group && !info?.userWord),
      })}
    >
      <div className="card__flex">
        <div
          className="card__img-container"
          style={{ backgroundImage: `url(${API_BASE_URL + "/" + info.image})` }}
        ></div>
        <div className="card__center">
          <div className="card__word">{info.word}</div>
          <div
            className="card__text"
            dangerouslySetInnerHTML={{ __html: info.textMeaning }}
          ></div>
        </div>
        <div
          className={classNames("card__controls", {
            "card__controls_no-badge": !isAuth || (!group && !info?.userWord),
          })}
        >
          <a className="card__control-option">
            <Icon url={API_BASE_URL + "/" + info.audio} type="sound" />
          </a>
          <a className="card__control-option" onClick={togglePopup}>
            <Icon type="info" />
          </a>
          {!group && info?.userWord?.difficulty === "hard" && (
            <a className="card__control-option" onClick={removeWord}>
              <Icon type="basket" />
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

export default Card;
