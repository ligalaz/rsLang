import React from "react";
import GameCard from "./game-card/game-card";
import AudioCallCard from "./game-card/audio-call-card/audio-call-card";
import SprintCard from "./game-card/sprint-card/sprint-card";
import SavannaCard from "./game-card/savanna-card/savanna-card";
import "./games-promo.scss";

const games = [
  {
    name: "audio call",
    link: "audiocall",
    promo: <AudioCallCard />,
    description:
      "You hear a word and see 5 possible translations. Your task is to choose the correct translation.",
  },
  {
    name: "sprint",
    link: "sprint",
    promo: <SprintCard />,
    description:
      "Speed ​​game. You have 1 minute to guess the word and score the maximum points.",
  },
  {
    name: "savanna",
    link: "savanna",
    promo: <SavannaCard />,
    description:
      "Words in a foreign language are falling, and you need to click on the correct translation of the translation. Don't forget about hearts.",
  },
];

const GamesPromo = (): JSX.Element => {
  return (
    <ul className="games-promo">
      {games.map((game) => (
        <GameCard key={game.name} game={game} />
      ))}
    </ul>
  );
};

export default GamesPromo;
