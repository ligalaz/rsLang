import React from "react";

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
