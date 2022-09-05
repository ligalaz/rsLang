import React from "react";
import artem from "../../../../assets/img/avatar/artem-mikula.jpg";
import evgeniia from "../../../../assets/img/avatar/evgeniia-zhadan.jpg";
import alexey from "../../../../assets/img/avatar/alexey.jpg";
import About from "./components/about/about";

const ABOUT = [
  {
    id: 1,
    name: "Artem Mikula",
    job: "team lead, developer",
    about: `Coordinated the work of the team, made the project basic settings, developed the application architecture,
      authorization, set up work with the backend, implemented the games' start screen, the Audio game, audio service,
      statistics graphs, was engaged in layout and adaptive`,
    avatar: artem,
    contacts: {
      telegram: "MRNOAH",
      linkedin: "feed/",
      github: "ligalaz",
    },
  },
  {
    id: 2,
    name: "Alexey",
    job: "developer",
    about: `Implemented the initial application page, configured routing, made a TextBook,
      a game selector from the textbook page, word cards and logic for them, statistics, configured pagination,the Savanna game,
      set up work with backend, was engaged in layout and adaptive`,
    avatar: alexey,
    contacts: {
      github: "intellectualDarknet",
    },
  },
  {
    id: 3,
    name: "Evgeniia Zhadan",
    job: "developer",
    about: `Made the registration page layout, implemented the game selector from the start page, the Sprint game,
      the game results screen, the team members description page, was engaged in layout and adaptive, created promo video`,
    avatar: evgeniia,
    contacts: {
      telegram: "zhadan93",
      github: "zhadan93",
    },
  },
];

function AboutUs() {
  return (
    <div className="page">
      <div className="page__descr">About us</div>
      <div className="page__line"></div>
      <div className="about">
        <div className="about__flex">
          {ABOUT.map((item) => (
            <About key={item.id} aboutPerson={item} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default AboutUs;
