import React from "react";
import Icon from "../../../../components/icon/icon";
import "./card.scss";

function Card() {
  return (
    <div className="card">
      <div className="card__flex">
        <img className="card__img" src="" alt="img" />
        <div className="card__center">
          <div className="card__title">alcohol</div>
          <div className="card__text">
            A person shold not drive a car he or she has been drinking alcohol.
          </div>
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
