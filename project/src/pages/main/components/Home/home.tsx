import React from "react";
import GamesPromo from "../games-promo/games-promo";
import "./home.scss";

function Home() {
  return (
    <div className="page">
      <div className="page__descr">{"Let's play!"}</div>
      <div className="page__line"></div>
      <GamesPromo />
    </div>
  );
}

export default Home;
