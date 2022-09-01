import React, { useState } from "react";
import Icon from "../../../../../components/icon/icon";
import "./audio-btn.scss";

interface AudioBtnDetails {
  isDisabled?: boolean;
  className?: string;
  width?: number;
  height?: number;
  setSound?: () => void;
}

const AudioBtn = ({
  isDisabled,
  className,
  width,
  height,
  setSound,
}: AudioBtnDetails): JSX.Element => {
  return (
    <div
      className={`circle circle__audio ${className} ${
        isDisabled && "circle__audio--disabled"
      }`}
      onClick={setSound}
    >
      <Icon type="speaker" width={width} height={height} />
    </div>
  );
};

export default AudioBtn;
