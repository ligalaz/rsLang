import React from "react";
import { API_BASE_URL } from "../../../../config";
import { IWord } from "../../../../interfaces/word";
import AudioCallRepeater from "./audiocall-repeater";
import "./audiocall-view.scss";

export interface IAudioCallView {
  current: IWord;
}

const AudioCallView = ({ current }: IAudioCallView) => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
      }}
    >
      <div
        className="audiocall__row-view-item view-img"
        style={{
          background: `url(${API_BASE_URL}/${current.image}) center center`,
          backgroundSize: "contain",
        }}
      ></div>
      <div className="audiocall__row-view-flex">
        <AudioCallRepeater
          className="word-repeater repeater-small"
          isCall={true}
          current={current}
        />
        <div className="audiocall__row-view-text-item">
          <p>{current.word}</p>
        </div>
      </div>
    </div>
  );
};

export default AudioCallView;
