import React from "react";
import Title from "../title/title";
import { IWord } from "../../../../../interfaces/word";
import AudioBtn from "../audio/audio-btn";
import "./result-block.scss";

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
      {answers.map(({ id, word, wordTranslate, transcription }) => (
        <div className="answer" key={id}>
          <div className="answer__word-container">
            <AudioBtn className="circle__audio--small" />
            <div>{word}</div>
          </div>
          <div className="answer__transcription">{transcription}</div>
          <div className="answer__translation">{wordTranslate}</div>
        </div>
      ))}
    </section>
  );
};

export default ResultBlock;
