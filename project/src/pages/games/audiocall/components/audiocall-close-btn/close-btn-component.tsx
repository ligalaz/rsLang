import React from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router";
import { settingsDown } from "../../../../../store/audiocall-settings-slice";
import { resetGame } from "../../../../../store/audiocall-slice";
import { AppDispatch } from "../../../../../store/store";

import "./close-btn.scss";

export interface ICloseProps {
  className?: string;
}

const CloseBtnComponent = ({ className }: ICloseProps) => {
  const dispatch: AppDispatch = useDispatch();
  const navigate = useNavigate();
  return (
    <button
      onClick={() => {
        dispatch(resetGame());
        dispatch(settingsDown());
        navigate("/main", { replace: true });
      }}
      className="__close-btn"
    >
      <div className="__close-btn-item first-item"></div>
      <div className="__close-btn-item second-item"></div>
    </button>
  );
};

export default CloseBtnComponent;
