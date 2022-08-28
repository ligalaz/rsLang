import React, { useState, useEffect, MouseEvent } from "react";
import ReactPaginate from "react-paginate";
import { useNavigate, useParams } from "react-router";
import { Link } from "react-router-dom";
import { Word } from "../../../../interfaces/word";
import { useGetUserWordsMutation } from "../../../../services/aggregated-words-service";
import { useGetWordsMutation } from "../../../../services/words-service";
import { RootState, useAppSelector } from "../../../../store/store";
import Card from "../card/card";
import PaginatedItems from "../pagination/pagination";
import PopUp from "../popUp/popUp";
import "./textbook.scss";

function Textbook() {
  const [getWords, { isLoading: isWordsLoading }] = useGetWordsMutation();
  const [getAggregatedWords, { isLoading: isUserWordsLoading }] =
    useGetUserWordsMutation();
  const { group, page } = useParams();
  const navigate = useNavigate();

  const userId: string = useAppSelector(
    (state: RootState) => state.authState.auth?.userId
  );

  function setPage(newPage: number) {
    navigate(`../textbook/${group}/${newPage}`, { replace: true });
  }
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
        params:
          +group != 6
            ? {
                page: parseInt(page),
                group: parseInt(group),
                wordsPerPage: 20,
              }
            : {
                filter: '{"userWord.difficulty":"hard"}',
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

      <div className="chapter">
        {new Array(userId ? 7 : 6).fill(0).map((_, index) => (
          <Link
            key={`chapter__${index}`}
            to={`../textbook/${index}/0`}
            className={`chapter__link ${
              +window.location.href.split("/")[5] === index
                ? `chapter__link${index}`
                : ""
            }`}
            type="button"
          >
            {index != 6 ? `Chapter ${index + 1}` : `Difficuilt words`}
          </Link>
        ))}
      </div>
      <div className="global__info">
        {+group - 6 && <PaginatedItems itemsPerPage={1} setPage={setPage} />}
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
