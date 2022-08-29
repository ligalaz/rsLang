import React, { useEffect, useState } from "react";
import { useAppSelector } from "../../../../../store/store";
import { useActions } from "../../../../../hooks/actions";
import { IWord } from "../../../../../interfaces/word";
import { useGetWordsQuery } from "../../../../../services/words-service";
import Timer from "../timer/timer";

const timerDetails = {
  delay: 1000,
  initial: 60,
  className: "sprint-timer",
};

const SprintGamePage = () => {
  const {
    addGameData,
    increaseTrueAnswersCount,
    resetTrueAnswersCount,
    increaseScore,
    addTrueAnswers,
    addFalseAnswers,
  } = useActions();
  const { gameData, trueAnswersCount, score, level } = useAppSelector(
    (state) => state.sprintState
  );

  const { data, isLoading } = useGetWordsQuery({ group: Number(level) - 1 });

  const [word, setWord] = useState("");
  const [wordTranslate, setWordTranslate] = useState("");

  const updateWord = () => {
    const randRightAnswerState = getRightAnswerState();

    const [randWordData, position] = getRandWord();
    addGameData(randWordData);

    const randWordTranslate = getRandWordTranslate(
      randRightAnswerState,
      randWordData,
      position
    );

    setWord(randWordData.word);
    setWordTranslate(randWordTranslate);
  };

  const getRandNumber = (max: number, min = 0): number => {
    const rand = min + Math.random() * (max + 1 - min);
    return Math.floor(rand);
  };

  const getRightAnswerState = () => {
    const rightAnswerStates = [true, false];
    const randRightAnswerStateNumber = getRandNumber(
      rightAnswerStates.length - 1
    );

    return rightAnswerStates.at(randRightAnswerStateNumber);
  };

  const getRandWord = (): [IWord, number] => {
    const randDataNumber = getRandNumber(data.length - 1);
    return [data.at(randDataNumber), randDataNumber];
  };

  const getRandWordTranslate = (
    rightAnswerState: boolean,
    wordData: IWord,
    position: number
  ): string => {
    let { wordTranslate } = wordData;

    if (!rightAnswerState) {
      const randomWordTranslateNumber = getRandNumber(data.length - 2);
      wordTranslate = [...data.slice(0, position), ...data.slice(position)].at(
        randomWordTranslateNumber
      ).wordTranslate;
    }

    return wordTranslate;
  };

  const checkTrueAnswer = () => {
    return gameData.at(-1).wordTranslate === wordTranslate;
  };

  const checkFalseAnswer = () => {
    return gameData.at(-1).wordTranslate !== wordTranslate;
  };

  const changeGameScore = (isTrue: boolean) => {
    const wordData = gameData.at(-1);

    if (isTrue) {
      increaseTrueAnswersCount();
      let points = 10;

      if (trueAnswersCount > 11) {
        points = 80;
      } else if (trueAnswersCount > 7) {
        points = 40;
      } else if (trueAnswersCount > 3) {
        points = 20;
      }

      increaseScore(points);
      addTrueAnswers(wordData);
    } else {
      resetTrueAnswersCount();
      addFalseAnswers(wordData);
    }
  };

  document.onkeydown = (event) => {
    let isTrue = false;

    if (event.code === "ArrowRight") {
      isTrue = checkTrueAnswer();
    }
    if (event.code === "ArrowLeft") {
      isTrue = checkFalseAnswer();
    }

    changeGameScore(isTrue);
    updateWord();
  };

  useEffect(() => {
    if (!isLoading) {
      updateWord();
    }
  }, [isLoading]);

  return (
    <div className="container">
      {isLoading ? (
        <div>...Loading</div>
      ) : (
        <>
          <header className="header">
            <div className="close-btn"></div>
          </header>
          <main className="main">
            <section className="sprint-game">
              <div className="sprint-game__header">
                <span className="score">{score}</span>
                <div></div>
              </div>
              <Timer timerDetails={timerDetails} />
              <div className="sprint-game__word">
                {word}
                <span className="sprint-game__word-translation">
                  {wordTranslate}
                </span>
              </div>
              <div>
                <button
                  onClick={() => {
                    const isTrue = checkFalseAnswer();
                    changeGameScore(isTrue);
                    updateWord();
                  }}
                  className="sprint-game__no-btn"
                >
                  неверно
                </button>
                <button
                  onClick={() => {
                    const isTrue = checkTrueAnswer();
                    changeGameScore(isTrue);
                    updateWord();
                  }}
                  className="sprint-game__yes-btn"
                >
                  верно
                </button>
              </div>
            </section>
          </main>
        </>
      )}
    </div>
  );
};

export default SprintGamePage;
