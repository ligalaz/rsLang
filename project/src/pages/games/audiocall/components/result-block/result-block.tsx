import React from "react";
import Title from "./title/title";
import { IWord } from "../../../../../interfaces/word";
import { AudioService } from "../../../../../utils/audio-service";

import "./result-block.scss";
import AudioCallRepeater from "../audiocall-repeater/audiocall-repeater";

export interface ResultBlockDetails {
  result: {
    answers: IWord[];
    header: string;
    titleClassName: string;
    titleChildClassName: string;
  };
  answersClassName: string;
}

const ResultBlock = ({
  result,
  answersClassName,
}: ResultBlockDetails): JSX.Element => {
  const { answers, header, titleClassName, titleChildClassName } = result;
  const headerComponents = header.split(" ");

  return (
    <section className={`answers ${answersClassName}`}>
      <Title className={titleClassName}>
        <>
          {headerComponents.slice(0, -1).join(" ")}
          <span className={`answers__count ${titleChildClassName}`}>
            {answers.length}
          </span>
          {headerComponents.slice(-1).join(" ")}
        </>
      </Title>
      {answers.map((word) => (
        <div className="answer" key={word.id}>
          <div className="answer__word-container">
            <AudioCallRepeater
              style={{ height: `50px` }}
              className="word-repeater repeater-mini"
              isCall={true}
              current={word}
            />
            <div>{word.word}</div>
          </div>
          <div className="answer__transcription">{word.transcription}</div>
          <div className="answer__translation">{word.wordTranslate}</div>
        </div>
      ))}
    </section>
  );
};

export default ResultBlock;
