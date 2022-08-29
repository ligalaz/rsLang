import React from "react";
import "./sprint-card.scss";

const SprintCard = (): JSX.Element => {
  return (
    <>
      <div className="sprint__circle sprint__circle--cross" />
      <span className="sprint__delim"></span>
      <div className="sprint__circle sprint__circle--tick" />
    </>
  );
};

export default SprintCard;
