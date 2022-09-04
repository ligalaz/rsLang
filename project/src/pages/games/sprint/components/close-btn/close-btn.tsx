import React from "react";
import { useNavigate } from "react-router";
import { useActions } from "../../../../../hooks/actions";
import "./close-btn.scss";

interface CloseBtnDetails {
  className?: string;
  isDisabled?: boolean;
}

const CloseBtn = ({ isDisabled, className }: CloseBtnDetails): JSX.Element => {
  const navigate = useNavigate();
  const { resetGame, settingsDown } = useActions();

  return (
    <div
      className={`circle circle__cross circle__cross--closed ${className} ${
        isDisabled && "circle--disabled"
      }`}
      onClick={() => {
        resetGame();
        settingsDown();
        navigate("/main", { replace: true });
      }}
    />
  );
};

export default CloseBtn;
