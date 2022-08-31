/* eslint-disable prettier/prettier */
import React from "react";
import Icon from "../../../../components/icon/icon";
import "./popUp.scss";
import { API_BASE_URL } from "../../../../config";
import { Word } from "../../../../interfaces/word";
import { RootState, useAppSelector } from "../../../../store/store";
import {
  useCreateUserWordMutation,
  useUpdateUserWordMutation,
} from "../../../../services/user-words-service";
import { IAuth } from "../../../../interfaces/auth";
import classNames from "classnames";

export interface IPopUp {
  key: string | number;
  info: Word;
  togglePopup?: () => void;
  number: number;
  clickPage: (value: number) => void;
}




function PopUp({ info, togglePopup, clickPage, number }: IPopUp) {
  const condition = number != 19;
  const auth: IAuth = useAppSelector(
    (state: RootState) => state.authState?.auth
  );

  const isAuth = !!auth;

  const [updateUserWord, { isLoading: isUserWordsLoading }] =
    useUpdateUserWordMutation();

  const [createUserWord] = useCreateUserWordMutation();

  function markAsHard(): void {
    if (info.userWord) {
      delete info.userWord?.optional?.learnedDate;
      updateUserWord({
        id: auth.userId,
        wordId: info.id,
        difficulty: "hard",
        optional: info.userWord?.optional?.toDto(),
      });
    } else {
      createUserWord({
        id: auth.userId,
        wordId: info.id,
        difficulty: "hard",
        optional: {
          firstSeenDate: new Date().toISOString(),
        },
      });
    }
  }

  function markAsLearned(): void {
    if (info.userWord) {
      updateUserWord({
        id: auth.userId,
        wordId: info.id,
        difficulty: "normal",
        optional: {
          ...info.userWord?.optional?.toDto(),
          learnedDate: new Date().toISOString(),
          firstSeenDate: info.userWord.optional?.firstSeenDate ?? new Date().toISOString(),
        },
      });
    } else {
      createUserWord({
        id: auth.userId,
        wordId: info.id,
        difficulty: "normal",
        optional: {
          learnedDate: new Date().toISOString(),
          firstSeenDate: new Date().toISOString(),
        },
      });
    }
  }

  return (
    <>
      <div
        onClick={togglePopup}
        className={classNames("popup", {
          hard: info?.userWord?.difficulty === "hard",
          normal: info?.userWord?.difficulty === "normal",
        })}
      >
        <div className="popup__sound">
          <Icon
            type="sound"
            url={API_BASE_URL + "/" + info.audio}
            audioExample={API_BASE_URL + "/" + info.audioMeaning}
            audioMeaning={API_BASE_URL + "/" + info.audioExample}
          />
        </div>
        <div className="popup__container">
          <div className="popup__top">
            <div className="popup__top-left popup__title">
              {info.word} - {info.wordTranslate}
            </div>
            <div className="popup__top-right">
              <div
                className="popup__image"
                style={{
                  backgroundImage: `url(${API_BASE_URL + "/" + info.image})`,
                }}
              ></div>
            </div>
          </div>
          <div className="popup__separator"></div>
          <div className="popup__bottom">
            <div className="popup__bottom-left">
              <div className="popup__subtitle" dangerouslySetInnerHTML={{ __html: info.textExample }}></div>
              <div className="popup__subtitle popup__mb-50">{info.textExampleTranslate}</div>
              <div
                className="popup__text"
                dangerouslySetInnerHTML={{ __html: info.textMeaning }}
              ></div>
              <div className="popup__text">{info.textMeaningTranslate}</div>
            </div>
            <div className="popup__bottom-right">
              <div className="popup__text">{info.transcription}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="popup__buttons">
        <button
          disabled={!number}
          onClick={() => clickPage(-1)}
          className="popup__button popup__button-prev"
        >
          Previous
        </button>

        <button
          disabled={!isAuth || info.userWord?.difficulty === "normal"}
          className="popup__button popup__button-known"
          onClick={() => markAsLearned()}
        >
          Learn
        </button>
        <button
          disabled={!isAuth || info.userWord?.difficulty === "hard"}
          onClick={() => markAsHard()}
          className="popup__button popup__button-hard"
        >
          Hard
        </button>
        <button
          disabled={!condition}
          onClick={() => clickPage(1)}
          className="popup__button popup__button-next"
        >
          Next
        </button>
      </div>

      <></>
    </>
  );
}

export default PopUp;
