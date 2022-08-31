import React from "react";
import GameCard from "./game-card/game-card";
import AudioCallCard from "./game-card/audio-call-card/audio-call-card";
import SprintCard from "./game-card/sprint-card/sprint-card";
import "./games-promo.scss";

const games = [
  {
    name: "audio call",
    promo: <AudioCallCard />,
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit",
  },
  {
    name: "sprint",
    promo: <SprintCard />,
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit",
  },
];

const GamesPromo = () => {
  return (
    <ul className="games-promo">
      {games.map((game) => (
        <GameCard key={game.name} game={game} />
      ))}
    </ul>
  );
};

export default GamesPromo;
