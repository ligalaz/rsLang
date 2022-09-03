import React from "react";
import AudioBtn from "../../../../../games/sprint/components/audio/audio-btn";
import "./audio-call-card.scss";

const AudioCallCard = (): JSX.Element => {
  return (
    <div className="audio-call__sound">
      <AudioBtn className="audio-call__circle" width={15.8} height={15.8} />
    </div>
  );
};

export default AudioCallCard;
