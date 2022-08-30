import React, { useState, useEffect, MouseEvent } from "react";
import { useNavigate, useParams } from "react-router";
import { Link } from "react-router-dom";
import Icon from "../../../../components/icon/icon";
import { Word } from "../../../../interfaces/word";
import { useGetUserWordsMutation } from "../../../../services/aggregated-words-service";
import { useGetWordsMutation } from "../../../../services/words-service";
import {
  RootState,
  useAppDispatch,
  useAppSelector,
} from "../../../../store/store";
import Card from "../card/card";
import PaginatedItems from "../pagination/pagination";
import PopUp from "../popUp/popUp";
import { removeById } from "../../../../store/words-slice";
import "./textbook.scss";
import { useUpdateUserWordMutation } from "../../../../services/user-words-service";

function Textbook() {
  const [getWords, { isLoading: isWordsLoading }] = useGetWordsMutation();
  const [getAggregatedWords, { isLoading: isUserWordsLoading }] =
    useGetUserWordsMutation();
  const { group, page } = useParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const [updateUserWord, { isLoading: isUserWordUpdateLoading }] =
    useUpdateUserWordMutation();

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

  async function updateDifficultWord(word: Word): Promise<void> {
    try {
      await updateUserWord({
        id: userId,
        wordId: word.id,
        difficulty: "new",
        optional: word.userWord?.optional?.toDto(),
      });
      dispatch(removeById(word.id));
      // eslint-disable-next-line no-empty
    } catch (e) {}
  }

  function gatherPopup(elem: number) {
    return (
      <>
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
      <div className="page page_with-border">
        <div className="page__descr">TextBook</div>
        <div className="page__line"></div>
        <div className="chapter">
          {new Array(userId ? 7 : 6).fill(0).map((_, index) => (
            <Link
              key={`chapter__${index}`}
              to={`../textbook/${index}/0`}
              className={`chapter__link ${
                +window.location.href.split("/")[5] === index
                  ? "chapter__link_active"
                  : ""
              }`}
              type="button"
            >
              {index != 6 ? `Group ${index + 1}` : `Difficuilt words`}
            </Link>
          ))}
        </div>
      </div>

      {isWordsLoading || isUserWordsLoading ? (
        <div className="textbook__loading">
          <Icon type="loading" />
        </div>
      ) : (
        <>
          <div className="textbook">
            <div className="textbook__wrapper">
              {words.length &&
                words.map((a, i) => (
                  <Card
                    key={a.id}
                    isAuth={!!userId}
                    info={a}
                    group={+group - 6}
                    removeWord={() => updateDifficultWord(a)}
                    togglePopup={() => togglePopup(i)}
                  />
                ))}
            </div>
          </div>
          <div className="global__info">
            {+group - 6 && (
              <PaginatedItems itemsPerPage={1} setPage={setPage} />
            )}
          </div>
        </>
      )}
    </>
  );
}

export default Textbook;
