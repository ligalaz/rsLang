import React from "react";
import { Link } from "react-router-dom";
import { GameCardItem } from "../../../../../interfaces/game-card";

const GameCard = (props: GameCardItem): JSX.Element => {
  const { name, description, promo } = props.game;

  return (
    <li className="game-card">
      <div className={`game-card__promo ${name.split(" ").join("-")}`}>
        {promo}
      </div>
      <div className="game-card__content">
        <div className="game-card__text-content">
          <h4 className="game-card__title">{name}</h4>
          <p className="game-card__description">{description}</p>
        </div>
        <Link className="game-card__start-btn" to="games">
          GO!
        </Link>
      </div>
    </li>
  );
};

export default GameCard;
