import React from "react";
import Icon from "../../../../../../components/icon/icon";
import { TELEGRAM_BASE_URL, LINKEDIN_BASE_URL } from "../../../../../../config";
import { Link } from "react-router-dom";
import "./about.scss";

interface AboutDetails {
  aboutPerson: {
    id: number;
    name: string;
    job: string;
    about: string;
    avatar: string;
    linkedin?: string;
    telegram?: string;
  };
}

const About = ({ aboutPerson }: AboutDetails) => {
  const { name, job, about, avatar, linkedin, telegram } = aboutPerson;

  return (
    <div className="about__column">
      <div className="about__avatar">
        <img
          className="about__avatar-img"
          src={avatar}
          alt="team member avatar"
        />
      </div>
      <div className="about__descr">
        <div className="about__title">
          {name}
          <a
            href={`${TELEGRAM_BASE_URL}${telegram}`}
            rel="noreferrer"
            target="_blank"
          >
            <Icon type="telegram" />
          </a>
          {linkedin && (
            <a
              href={`${TELEGRAM_BASE_URL}${linkedin}`}
              rel="noreferrer"
              target="_blank"
            >
              <Icon type="linkedin" />
            </a>
          )}
        </div>
        <div className="about__line"></div>
        <div className="about__job">{job}</div>
        <div className="about__text">{about}</div>
      </div>
    </div>
  );
};
export default About;
