import React from "react";
import "./close-btn.scss";

const CloseBtnComponent = () => {
  return (
    <button className="__close-btn">
      <div className="__close-btn-item first-item"></div>
      <div className="__close-btn-item second-item"></div>
    </button>
  );
};

export default CloseBtnComponent;
