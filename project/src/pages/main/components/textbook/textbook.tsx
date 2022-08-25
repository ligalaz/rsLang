import React, { MouseEventHandler, useEffect, useState } from "react";
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

  const [popUp, setpopup] = useState(false);
  const [i, seti] = useState(-1);

  function togglePopup(value: number) {
    seti(value);
    setpopup((prev) => !prev);
  }

  function untoggle(event: any) {
    if (!event.target.closest(".card")) {
      setpopup((prev) => !prev);
    }
  }

  function gather(elem: number) {
    console.log(words[elem]);
    return (
      <>
        <div className="filter"></div>
        <div onClick={untoggle} className="overlay">
          <div className="overlay__container">
            <Card key={"777"} info={words[elem]} />
          </div>
        </div>
      </>
    );
  }

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
  console.log("words", words);
  return (
    <>
      {popUp && gather(i)}
      <div className="page">
        <div className="page__descr">Dictionary</div>
        <div className="page__line"></div>
      </div>
      <div className="textbook">
        <div className="textbook__wrapper">
          {words.length &&
            words.map((a, i) => (
              <Card key={a.id} info={a} togglePopup={() => togglePopup(i)} />
            ))}
        </div>
      </div>
    </>
  );
}

export default Textbook;
