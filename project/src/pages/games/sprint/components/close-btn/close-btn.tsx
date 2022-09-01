import React from "react";
import "./close-btn.scss";

interface CloseBtnDetails {
  className?: string;
  isDisabled?: boolean;
  close?: () => void;
}

const CloseBtn = ({
  isDisabled,
  className,
  close,
}: CloseBtnDetails): JSX.Element => {
  return (
    <div
      className={`circle circle__cross circle__cross--closed ${className} ${
        isDisabled && "circle--disabled"
      }`}
      onClick={() => close()}
    />
  );
};

export default CloseBtn;
