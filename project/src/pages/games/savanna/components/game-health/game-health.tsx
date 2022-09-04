import React from "react";
import Icon from "../../../../../components/icon/icon";
import "./game-health.scss";

interface GameHealthProps {
  health: number;
}

const GameHealth = ({ health }: GameHealthProps) => {
  function generateHealthArray(): number[] {
    return new Array(5)
      .fill(0)
      .map((_: number, index) => (index + 1 <= health ? 1 : 0));
  }

  return (
    <div className="game-health">
      {generateHealthArray().map((elem: number, index: number) => (
        <div key={index} className="game-health__icon">
          <Icon type={elem ? "heart" : "heart-empty"} />
        </div>
      ))}
    </div>
  );
};

export default GameHealth;
