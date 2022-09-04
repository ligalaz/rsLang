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
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit",
  },
  {
    name: "sprint",
    link: "sprint",
    promo: <SprintCard />,
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit",
  },
  {
    name: "savanna",
    link: "savanna",
    promo: <SavannaCard />,
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit",
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
