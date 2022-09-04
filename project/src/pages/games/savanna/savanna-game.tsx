import React, {
  useEffect,
  useState,
  useCallback,
  useLayoutEffect,
  useRef,
} from "react";
import { GetWordsRequest, Word } from "../../../interfaces/word";
import { useGetUserWordsMutation } from "../../../services/aggregated-words-service";
import { useGetWordsMutation } from "../../../services/words-service";
import { RootState, useAppSelector } from "../../../store/store";
import { shuffle } from "../../../utils/shuffle";
import { AudioService } from "../../../utils/audio-service";
import tick from "../../../assets/sound/tick.mp3";
import cross from "../../../assets/sound/cross.mp3";
import GameHealth from "./components/game-health/game-health";
import CloseBtn from "../../../components/close-btn/close-btn";
import classNames from "classnames";
import { useNavigate, useSearchParams } from "react-router-dom";
import { GameStartScreen } from "../../../components/game-start-screen/game-start-screen";
import SavannaResult from "./components/game-result/savanna-result";
import { useEventListener } from "usehooks-ts";
import "./savanna-game.scss";
import { notify } from "../../../utils/notifications";
import { toast } from "react-toastify";

export interface GameResult {
  true?: Word[];
  false?: Word[];
}

type GameMode = "start" | "play" | "result";

const SavannaGame = (): JSX.Element => {
  const userId: string = useAppSelector(
    (state: RootState) => state.authState.auth?.userId
  );
  const [page, setPage] = useState<number>(0);
  const [group, setGroup] = useState<number>(0);
  const [currentWord, setCurrentWord] = useState<Word>(null);
  const [answer, setAnswer] = useState<Word>(null);
  const [stepWords, setStepWords] = useState<Word[]>([]);
  const [result, setResult] = useState<GameResult>({});
  const [gameMode, setGameMode] = useState<GameMode>("start");
  const [health, setHealth] = useState<number>(0);
  const [mode, setMode] = useState<"textbook" | "main">("main");
  const healthRef = useRef<number>(health);
  const gameWords = useRef<Word[]>([]);
  const documentRef = useRef<Document>(document);
  healthRef.current = health;

  const [getWords] = useGetWordsMutation();
  const [getAggregatedWords] = useGetUserWordsMutation();

  const [searchParams, setSearchParams] = useSearchParams();

  const navigate = useNavigate();

  const words: Word[] = useAppSelector(
    (state: RootState) => state.wordsState?.words || []
  );

  useEffect(() => {
    const group = searchParams.get("group");
    const page = searchParams.get("page");
    if (group) {
      setMode("textbook");
      setGroup(parseInt(group));
      if (page) {
        setPage(parseInt(page));
      }
    }
  }, [searchParams]);

  useEffect(() => {
    if (currentWord) {
      setStepWords(
        shuffle([
          currentWord,
          ...shuffle(
            words.filter((word: Word) => word.id !== currentWord.id)
          ).slice(0, 3),
        ])
      );
    }
  }, [currentWord]);

  useEffect(() => {
    if (!health && gameMode === "play") {
      setGameMode("result");
    }
  }, [health]);

  useLayoutEffect(() => {
    if (answer) {
      checkAnswer();
      setTimeout(() => {
        setAnswer(null);
        if (healthRef.current) {
          nextStep();
        }
      }, 300);
    }
  }, [answer]);

  useEffect(() => {
    switch (gameMode) {
      case "start":
        getProperlyWords();
        break;
      case "play":
        if (words.length < 10 && group === 6) {
          notify(
            "Lack words count for game. Please add more difficult words",
            toast.warning
          );
          navigate("/main", { replace: true });
        }
        setHealth(5);
        gameWords.current = [...words];
        nextStep();
        setResult({});
        break;
      case "result":
        setHealth(null);
        setStepWords([]);
        gameWords.current = [];
        setCurrentWord(null);
        break;
      default:
        break;
    }
  }, [gameMode]);

  function handleKeyboardEvent(event: KeyboardEvent): void {
    if (health) {
      switch (event.key) {
        case "1":
        case "2":
        case "3":
        case "4":
          makeAnswer(stepWords[parseInt(event.key) - 1]);
          break;
        default:
          break;
      }
    }
  }

  function getProperlyWords(): void {
    const request: GetWordsRequest = prepareRequest();
    if (userId) {
      getAggregatedWords({ userId, params: request });
    } else {
      getWords(request);
    }
  }

  function prepareRequest(): GetWordsRequest {
    const request: GetWordsRequest = {};
    switch (mode) {
      case "main":
        request.group = group;
        request.wordsPerPage = 600;
        break;
      case "textbook":
        if (request.group === 6) {
          request.filter = '{"userWord.difficulty":"hard"}';
          request.wordsPerPage = 3600;
        } else {
          request.group = group;
          request.wordsPerPage = (request.page + 1) * 20;
        }
        break;
      default:
        break;
    }
    return request;
  }

  const nextStep = useCallback(() => {
    if (gameWords.current.length) {
      setCurrentWord(gameWords.current[gameWords.current.length - 1]);
      gameWords.current = gameWords.current.slice(
        0,
        gameWords.current.length - 1
      );
    } else {
      setGameMode("result");
    }
  }, [gameWords]);

  function makeAnswer(word: Word) {
    if (!answer) {
      setAnswer(word);
    }
  }

  function checkAnswer(): void {
    if (answer.id === currentWord.id) {
      setResult({
        ...result,
        true: result.true ? [...result.true, currentWord] : [currentWord],
      });
      AudioService.play([tick], false);
    } else {
      setResult({
        ...result,
        false: result.false ? [...result.false, currentWord] : [currentWord],
      });
      setHealth((prev: number) => prev - 1);
      AudioService.play([cross], false);
    }
  }

  useEventListener("keydown", handleKeyboardEvent, documentRef);

  return (
    <>
      {gameMode === "start" && (
        <GameStartScreen
          mode={mode}
          group={group}
          onGroupSelect={(group: number) => setGroup(group)}
          page={page}
          onPageSelect={(page: number) => setPage(page)}
          onTimerStart={() => getProperlyWords()}
          onTimerFinish={() => setGameMode("play")}
          game="savanna"
        />
      )}
      {["play", "result"].includes(gameMode) && (
        <div className="savanna-game">
          <div className="savanna-game__close-btn">
            <CloseBtn />
          </div>
          <div className="savanna-game__wrapper">
            {currentWord && (
              <div
                key={currentWord.id}
                onAnimationEnd={() => makeAnswer(new Word())}
                className="savanna-game__current-word"
              >
                {currentWord?.wordTranslate}
              </div>
            )}
            {currentWord && (
              <div className="savanna-game__health">
                <GameHealth health={health} />
              </div>
            )}
            {currentWord && (
              <>
                <div className="savanna-game__answers">
                  {stepWords.map((word: Word, index: number) => (
                    <div
                      onClick={() => makeAnswer(word)}
                      key={word.id}
                      className={classNames("savanna-game__answer", {
                        "savanna-game__answer_correct":
                          answer && word.id === currentWord.id,
                        "savanna-game__answer_wrong":
                          answer &&
                          word.id === answer.id &&
                          word.id !== currentWord.id,
                      })}
                    >
                      {index + 1}. {word.word}
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      )}
      {gameMode === "result" && (
        <SavannaResult
          result={result}
          onNewGame={() => setGameMode("start")}
          onRestart={() => setGameMode("play")}
        />
      )}
    </>
  );
};

export default SavannaGame;
