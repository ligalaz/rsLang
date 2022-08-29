import "./personal.scss";
import React from "react";
import Icon from "../../../../components/icon/icon";
import { RootState, useAppSelector } from "../../../../store/store";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { Link } from "react-router-dom";

function Personal() {
  const name: string = useAppSelector(
    (state: RootState) => state.authState.auth?.name
  ) as string;
  const percentage = 66;

  return (
    <div className="personal">
      <div className="personal__wrapper">
        <div className="personal__upper">
          <Icon type="icon" />
        </div>
        <div className="personal__title">{name ?? "Student1"}</div>
        <div className="personal__progress">
          <div className="personal__success">Progress</div>
        </div>
        <div className="personal__diagram">
          <CircularProgressbar value={percentage} text={`${percentage}%`} />
        </div>
        <div className="personal__games">
          <Link
            style={{ textDecoration: "none" }}
            to="/registration"
            className="personal__game personal__game1"
            type="button"
          >
            Sprint
          </Link>

          <Link
            style={{ textDecoration: "none" }}
            to="/registration"
            className="personal__game personal__game2"
            type="button"
          >
            Audio call
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Personal;
