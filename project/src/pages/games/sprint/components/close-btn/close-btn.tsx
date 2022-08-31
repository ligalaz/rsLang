import React from "react";
import "./close-btn.scss";

interface CloseBtnDetails {
  isDisabled?: boolean;
  setSound?: () => void;
}

const CloseBtn = ({ isDisabled }: CloseBtnDetails): JSX.Element => {
  return (
    <div
      className={`circle circle__cross circle__cross--closed ${
        isDisabled && "circle--disabled"
      }`}
    />
  );
};

export default CloseBtn;
