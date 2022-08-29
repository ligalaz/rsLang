import React from "react";
import { ResultBlockDetails } from "../../../../../interfaces/result-block";

const ResultBlock = ({ result }: { result: ResultBlockDetails }) => {
  const { answers, header, classModifier } = result;
  const headerComponents = header.split(" ");
  return (
    <section className="answers">
      <h3 className="answers__title">
        {headerComponents.slice(0, -1).join(" ")}
        <span className={`answers__count answers__count--${classModifier}`}>
          {answers.length}
        </span>
        {headerComponents.slice(-1).join(" ")}
      </h3>
      {answers.map(({ id, word, wordTranslate }) => (
        <div className="answers__item" key={id}>
          <div>{word}</div>
          <div>{wordTranslate}</div>
        </div>
      ))}
    </section>
  );
};

export default ResultBlock;
