import React, { useEffect, useState } from "react";
import { GetWordsRequest, IWord } from "../../../../interfaces/word";
import { useGetWordsQuery } from "../../../../services/words-service";
import Card from "../card/card";
import "./textbook.scss";

function Textbook() {
  // const [params, setParams] = useState<GetWordsRequest>({
  //   group: 0,
  //   page: Math.round(1 * 20),
  // });
  const {
    data: words = [],
    isLoading,
    isFetching: isWordsFetching,
  } = useGetWordsQuery({ page: 0, group: 0 });
  const [cards, setCards] = useState(words);

  // const [randomWords, setRandomWords] = useState<IWord[]>([]);

  // useEffect(() => {
  //   if (!isLoading && randomWords.length < 21) {
  //     setParams((prev: GetWordsRequest) => ({
  //       ...prev,
  //       page: Math.round(Math.random() * 20),
  //     }));
  //   }
  // }, [words]);

  // useEffect(() => {
  //   setRandomWords((prev: IWord[]) => [...prev, ...words]);
  // }, [words]);

  // useEffect(() => {
  //   if (isLoading === false && words.length) {
  //     setCards(words);
  //   }
  // }, [words]);

  console.log("words", words, isLoading);
  return (
    <>
      <div className="page">
        <div className="page__descr">Dictionary</div>
        <div className="page__line"></div>
      </div>
      <div className="textbook">
        <div className="textbook__wrapper">
          {words.map((a) => (
            <Card key={a.id} info={a} />
          ))}
        </div>
      </div>
    </>
  );
}

export default Textbook;
