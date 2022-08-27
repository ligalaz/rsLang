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
    (state: RootState) => state.authState.auth
  );

  const isAuth = !!auth;

  const [updateUserWord, { isLoading: isUserWordsLoading }] =
    useUpdateUserWordMutation();

  const [createUserWord] = useCreateUserWordMutation();

  function markAsHard(): void {
    if (info.userWord) {
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
      });
    }
  }

  function markAsLearned(): void {
    if (info.userWord) {
      updateUserWord({
        id: auth.userId,
        wordId: info.id,
        difficulty: info.userWord?.difficulty ?? "normal",
        optional: {
          ...info.userWord?.optional?.toDto(),
          time: new Date().toISOString(),
        },
      });
    } else {
      createUserWord({
        id: auth.userId,
        wordId: info.id,
        difficulty: "normal",
        optional: {
          time: new Date().toISOString(),
        },
      });
    }
  }

  return (
    <>
      <div
        onClick={togglePopup}
        className={`popup ${
          info?.userWord?.difficulty === "hard"
            ? "hard"
            : info?.userWord?.difficulty === "normal"
            ? "normal"
            : ""
        }`}
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
          <div className="popup__center">
            <div className="popup__column-left">
              <div className="popup__titles">
                <div className="popup__word-en">{info.word}</div>
                <div className="popup__word-transq">{info.transcription}</div>
                <div className="popup__word-ru">{info.wordTranslate}</div>
              </div>
              <div className="popup__titles-footer">
                <div
                  className="popup__text"
                  dangerouslySetInnerHTML={{ __html: info.textMeaning }}
                ></div>
              </div>
            </div>
            <div className="popup__column-rigth">
              <img
                className="popup__img"
                src={API_BASE_URL + "/" + info.image}
                alt="img"
              />
            </div>
          </div>
          <div className="popup__line"></div>
          <div className="popup__text">{info.textMeaningTranslate}</div>
          <div className="popup__footer">
            <div
              className="popup__text"
              dangerouslySetInnerHTML={{ __html: info.textExample }}
            ></div>
            <div className="popup__text">{info.textExampleTranslate}</div>
          </div>
        </div>
      </div>

      <div className="popup__buttons">
        <button
          disabled={!number}
          onClick={() => clickPage(-1)}
          className="popup__button popup__button-prev"
        >
          Предыдущая
        </button>

        <button
          disabled={!isAuth || !!info.userWord?.optional?.time}
          className="popup__button popup__button-known"
          onClick={() => markAsLearned()}
        >
          Изучил
        </button>
        <button
          disabled={!isAuth || info.userWord?.difficulty === "hard"}
          onClick={() => markAsHard()}
          className="popup__button popup__button-hard"
        >
          Сложно
        </button>
        <button
          disabled={!condition}
          onClick={() => clickPage(1)}
          className="popup__button popup__button-next"
        >
          Cледующая
        </button>
      </div>

      <></>
    </>
  );
}

export default PopUp;
