/* eslint-disable prettier/prettier */
import React, { useEffect } from "react";
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
import { useUpdateUserStatisticsMutation } from "../../../../services/statistics-service";
import { getStartOfDayDate } from "../../../../utils/get-start-of-day-date";
import { IStatistic } from "../../../../interfaces/statistic";
import { AudioService } from "../../../../utils/audio-service";

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
  const statistics: IStatistic = useAppSelector(
    (state: RootState) => state.statisticsState?.statistics
  );

  const isAuth = !!auth;

  const [updateUserWord] = useUpdateUserWordMutation();
  const [createUserWord] = useCreateUserWordMutation();
  const [updateUserStatistics] = useUpdateUserStatisticsMutation();

  useEffect(() => {
    if (!info.userWord && auth) {
      createUserWord({
        id: auth.userId,
        wordId: info.id,
        difficulty: "seen",
        optional: {
          firstSeenDate: getStartOfDayDate(),
        },
      })
    }
    AudioService.stop();
  }, [info])

  async function markAsHard(): Promise<void> {
    try {
      if (info.userWord) {
        const isLearned = info.userWord?.difficulty === "learned";
        delete info.userWord?.optional?.learnedDate;
        await updateUserWord({
          id: auth.userId,
          wordId: info.id,
          difficulty: "hard",
          optional: info.userWord?.optional?.toDto(),
        });
        if (isLearned) {
          updateUserStatistics({ userId: auth.userId, request: {
            learnedWords: statistics?.learnedWords - 1,
            optional: statistics?.optional || {}
          }})
        }
      }
    } catch(e) {
      console.log(e);
    }
  }

  async function markAsLearned(): Promise<void> {
    await updateUserWord({
      id: auth.userId,
      wordId: info.id,
      difficulty: "learned",
      optional: {
        ...info.userWord?.optional?.toDto(),
        learnedDate: getStartOfDayDate(),
      },
    });
    updateUserStatistics({ userId: auth.userId, request: {
      learnedWords: (statistics?.learnedWords || 0) + 1,
      optional: statistics?.optional || {}
    }})
  }

  return (
    <>
      <div
        onClick={togglePopup}
        className={classNames("popup", {
          hard: info?.userWord?.difficulty === "hard",
          normal: info?.userWord?.difficulty === "learned",
        })}
      >
        <div className="popup__sound">
          <Icon
            type="sound"
            onClick={() => AudioService.play(info.audio, info.audioMeaning, info.audioExample)}
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
              <div className="popup__text popup__transcription">{info.transcription}</div>
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
          disabled={!info.userWord || info.userWord?.difficulty === "learned"}
          className="popup__button popup__button-known"
          onClick={() => markAsLearned()}
        >
          Learn
        </button>
        <button
          disabled={!info.userWord || info.userWord?.difficulty === "hard"}
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
