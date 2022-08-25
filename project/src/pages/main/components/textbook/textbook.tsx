import React, { useState } from "react";
import { GetWordsRequest, IWord } from "../../../../interfaces/word";
import { useGetWordsQuery } from "../../../../services/words-service";
import Card from "../card/card";
import PopUp from "../popUp/popUp";
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
  const [idPopUp, setidPopUp] = useState(-1);

  function togglePopup(value: number) {
    setidPopUp(value);
    setpopup((prev) => !prev);
  }

  function clickNext() {
    console.log(idPopUp);
    setidPopUp((prev) => ++prev);
  }

  function clickExit() {
    setpopup((prev) => !prev);
  }

  function untoggle(event: any) {
    console.log(
      event.target.closest(".popup"),
      event.target.closest(".popup__button")
    );
    if (
      !(
        event.target.closest(".popup") || event.target.closest(".popup__button")
      )
    ) {
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
            <PopUp
              clickExit={clickExit}
              number={idPopUp}
              clickNext={clickNext}
              key={words[elem].id}
              info={words[elem]}
            />
          </div>
        </div>
      </>
    );
  }

  console.log("words", words);
  return (
    <>
      {popUp && gather(idPopUp)}
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
