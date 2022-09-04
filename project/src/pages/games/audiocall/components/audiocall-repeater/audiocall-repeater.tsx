import React from "react";
import { CallIcon } from "../../../../../components/icon/call-icon";
import { IWord } from "../../../../../interfaces/word";
import { audioService } from "../../../../../services/audio-service";
import "./audiocall-repeater.scss";

export interface IRepeater {
  isCall: boolean;
  current?: IWord;
  className?: string;
  style?: {
    height: string;
  };
}

const AudioCallRepeater = (props: IRepeater) => {
  if (props.isCall) {
    return (
      <div style={{ display: "flex", justifyContent: "center" }}>
        <button
          className={props.className}
          onClick={() =>
            audioService(
              {
                audio: props.current.audio,
                audioExample: props.current.audioExample,
                audioMeaning: props.current.audioMeaning,
              },
              false
            )
          }
        >
          <CallIcon fill="white" className="word-repeater__logo" id="svg" />
        </button>
      </div>
    );
  }
  return (
    <div style={{ display: "flex", justifyContent: "center" }}>
      <button className="word-repeater">
        <CallIcon fill="white" className="word-repeater__logo" id="svg" />
      </button>
    </div>
  );
};

export default AudioCallRepeater;
