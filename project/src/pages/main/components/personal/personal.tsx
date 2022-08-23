import "./personal.scss";
import React from "react";
import getIcon from "../../../../components/icon/icon";

function Personal() {
  return (
    <div className="personal">
      <div className="personal__wrapper">
        <div className="personal__upper">
          {getIcon("icon")}
          <div className="personal__title">Elena</div>
          <div className="personal__city B2">Minsk</div>
        </div>
        <div className="personal__progress">
          <div className="personal__words-flex">
            <div className="personal__flex-left">
              <div className="personal__descr">new worlds</div>
              <div className="personal__counter">20/30</div>
            </div>
            <div className="personal__flex-right">
              <div className="personal__descr">cards showed</div>
              <div className="personal__counter">20/30</div>
            </div>
          </div>
          <p className="personal__success">Progress 72%</p>
        </div>
        <div className="personal__diagram"></div>
      </div>
    </div>
  );
}

export default Personal;
