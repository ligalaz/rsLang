import React from "react";
import Card from "../card/card";
import "./textbook.scss";

function Textbook() {
  return (
    <>
      <div className="page">
        <div className="page__descr">Dictionary</div>
        <div className="page__line"></div>
      </div>
      <div className="textbook">
        <div className="textbook__wrapper">
          <Card />
        </div>
      </div>
    </>
  );
}

export default Textbook;
