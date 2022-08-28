import React, { useEffect, useState } from "react";
import { useAppSelector } from "../../../../../store/store";
import { useActions } from "../../../../../hooks/actions";
import { IWord } from "../../../../../interfaces/word";
import Timer from "../timer/timer";

const timerDetails = {
  delay: 1000,
  initial: 60,
  className: "sprint-timer",
};

const SprintGame = () => {
  const { data } = useAppSelector((state) => state.sprintState);
  const { addGameData } = useActions();
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

  const getRandomNumber = (max: number, min = 0): number => {
    const rand = min + Math.random() * (max + 1 - min);
    console.log();
    return Math.floor(rand);
  };

  const getRightAnswerState = () => {
    const rightAnswerStates = [true, false];
    const randRightAnswerStateNumber = getRandomNumber(
      rightAnswerStates.length - 1
    );

    return rightAnswerStates.at(randRightAnswerStateNumber);
  };

  const getRandWord = (): [IWord, number] => {
    const randDataNumber = getRandomNumber(data.length - 1);
    return [data.at(randDataNumber), randDataNumber];
  };

  const getRandWordTranslate = (
    rightAnswerState: boolean,
    wordData: IWord,
    position: number
  ): string => {
    let { wordTranslate } = wordData;

    if (!rightAnswerState) {
      const randomWordTranslateNumber = getRandomNumber(data.length - 2);
      wordTranslate = [...data.slice(0, position), ...data.slice(position)].at(
        randomWordTranslateNumber
      ).wordTranslate;
    }

    return wordTranslate;
  };

  useEffect(() => {
    updateWord();
  }, []);

  return (
    <div className="container">
      <header className="header">
        <div className="close-btn"></div>
      </header>
      <main className="main">
        <section className="sprint-game">
          <div className="sprint-game__header">
            <span className="score"></span>
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
            <button className="sprint-game__no-btn">неверно</button>
            <button className="sprint-game__yes-btn">верно</button>
          </div>
        </section>
      </main>
    </div>
  );
};

export default SprintGame;
