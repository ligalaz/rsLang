import React, { useEffect, useState, KeyboardEvent } from "react";
import { Word } from "../../../interfaces/word";
import { useGetUserWordsMutation } from "../../../services/aggregated-words-service";
import { useGetWordsMutation } from "../../../services/words-service";
import { RootState, useAppSelector } from "../../../store/store";
import { shuffle } from "../../../utils/shuffle";
import { AudioService } from "../../../utils/audio-service";
import tick from "../../../assets/sound/tick.mp3";
import cross from "../../../assets/sound/cross.mp3";
import "./savanna-game.scss";
import GameHealth from "./components/game-health/game-health";

interface GameResult {
  true?: Word[];
  false?: Word[];
}

const SavannaGame = (): JSX.Element => {
  const userId: string = useAppSelector(
    (state: RootState) => state.authState.auth?.userId
  );
  const [page, setPage] = useState<number>(0);
  const [group, setGroup] = useState<number>(0);
  const [currentWord, setCurrentWord] = useState<Word>(null);
  const [health, setHealth] = useState<number>(null);
  const [gameWords, setGameWords] = useState<Word[]>([]);
  const [stepWords, setStepWords] = useState<Word[]>([]);
  const [result, setResult] = useState<GameResult>({});

  const [getWords] = useGetWordsMutation();
  const [getAggregatedWords] = useGetUserWordsMutation();

  const words: Word[] = useAppSelector(
    (state: RootState) => state.wordsState?.words
  );

  useEffect(() => {
    getProperlyWords();
  }, []);

  useEffect(() => {
    if (words?.length) {
      setGameWords([...words]);
    }
  }, [words]);

  useEffect(() => {
    setStepWords(shuffle([currentWord, ...shuffle(gameWords).slice(0, 3)]));
  }, [currentWord]);

  useEffect(() => {
    if (!health) {
      finishGame();
    }
  }, [health]);

  function handleKeyboardEvent(event: KeyboardEvent<HTMLDivElement>): void {
    if (health) {
      switch (event.key) {
        case "1":
        case "2":
        case "3":
        case "4":
          checkAnswer(stepWords[parseInt(event.key) - 1]);
          break;
        default:
          break;
      }
    }
  }

  function getProperlyWords(): void {
    if (userId) {
      getAggregatedWords({
        userId,
        params: {
          page,
          group,
          wordsPerPage: 20,
        },
      });
    } else {
      getWords({ page: page, group: group });
    }
  }

  function startGame(): void {
    setHealth(5);
    nextStep();
  }

  function finishGame(): void {
    setStepWords([]);
    setGameWords([]);
    setCurrentWord(null);
  }

  function nextStep(): void {
    if (gameWords.length) {
      setCurrentWord(gameWords[gameWords.length - 1]);
      setGameWords(gameWords.slice(0, gameWords.length - 1));
    }
  }

  function checkAnswer(word: Word) {
    if (word.id === currentWord.id) {
      setResult({
        ...result,
        true: result.true ? [...result.true, word] : [word],
      });
      AudioService.play([tick], false);
    } else {
      setResult({
        ...result,
        false: result.false ? [...result.false, word] : [word],
      });
      setHealth((prev: number) => prev - 1);
      AudioService.play([cross], false);
    }
    nextStep();
  }

  return (
    <div
      className="savanna-game"
      onKeyDown={(event) => handleKeyboardEvent(event)}
    >
      <GameHealth health={health} />
      {currentWord && (
        <>
          <div className="savanna-game__current-word">
            {currentWord.wordTranslate}
          </div>
          <div className="savanna-game__answers">
            {stepWords.map((word: Word, index: number) => (
              <div
                onClick={() => checkAnswer(word)}
                key={word.id}
                className="savanna-game__answer"
              >
                {index + 1}. {word.word}
              </div>
            ))}
          </div>
        </>
      )}
      <button onClick={startGame}>Start game</button>
    </div>
  );
};

export default SavannaGame;
