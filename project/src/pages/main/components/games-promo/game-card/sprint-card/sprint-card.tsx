import React from "react";
import "./sprint-card.scss";

const SprintCard = (): JSX.Element => {
  return (
    <>
      <div className="circle circle__cross" />
      <span className="sprint__delim"></span>
      <div className="circle circle__tick" />
    </>
  );
};

export default SprintCard;
