import React, { useState, useEffect, MouseEvent } from "react";
import { useParams } from "react-router";
import { Word } from "../../../../interfaces/word";
import { useGetUserWordsMutation } from "../../../../services/aggregated-words-service";
import { useGetWordsMutation } from "../../../../services/words-service";
import { RootState, useAppSelector } from "../../../../store/store";
import Card from "../card/card";
import PopUp from "../popUp/popUp";
import "./textbook.scss";

function Textbook() {
  const [getWords, { isLoading: isWordsLoading }] = useGetWordsMutation();
  const [getAggregatedWords, { isLoading: isUserWordsLoading }] =
    useGetUserWordsMutation();
  const { group, page } = useParams();

  const userId: string = useAppSelector(
    (state: RootState) => state.authState.auth?.userId
  );

  const words: Word[] = useAppSelector(
    (state: RootState) => state.wordsState.words || []
  );

  const [popUp, setPopup] = useState(false);
  const [idPopUp, setIdPopup] = useState(-1);

  useEffect(() => {
    getProperlyWords();
  }, [page, group]);

  function getProperlyWords(): void {
    if (userId) {
      getAggregatedWords({
        userId,
        params: {
          page: parseInt(page),
          group: parseInt(group),
          wordsPerPage: 20,
        },
      });
    } else {
      getWords({ page: parseInt(page), group: parseInt(group) });
    }
  }

  function togglePopup(value: number) {
    setIdPopup(value);
    setPopup((prev) => !prev);
  }

  function clickPage(value: number): void {
    setIdPopup((prev) => prev + value);
  }

  function untoggle(event: MouseEvent<HTMLElement>): void {
    const target: HTMLElement = event.target as HTMLElement;
    if (!(target.closest(".popup") || target.closest(".popup__button"))) {
      setPopup((prev) => !prev);
    }
  }

  function gatherPopup(elem: number) {
    return (
      <>
        <div className="filter"></div>
        <div onClick={untoggle} className="overlay">
          <div className="overlay__container">
            <PopUp
              number={idPopUp}
              clickPage={clickPage}
              key={words[elem].id}
              info={words[elem]}
            />
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      {popUp && gatherPopup(idPopUp)}
      <div className="page">
        <div className="page__descr">Dictionary</div>
        <div className="page__line"></div>
      </div>

      {isWordsLoading || isUserWordsLoading ? (
        <div className="textbook__loading"></div>
      ) : (
        <div className="textbook">
          <div className="textbook__wrapper">
            {words.length &&
              words.map((a, i) => (
                <Card key={a.id} info={a} togglePopup={() => togglePopup(i)} />
              ))}
          </div>
        </div>
      )}
    </>
  );
}

export default Textbook;
