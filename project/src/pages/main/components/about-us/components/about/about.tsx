import React from "react";
import { CONTACTS_BASE_URLS } from "../../../../../../config";
import { ContactsIcon } from "../../../../../../components/icon/contacts-icon";
import "./about.scss";

interface AboutDetails {
  aboutPerson: {
    id: number;
    name: string;
    job: string;
    about: string;
    avatar: string;
    contacts: {
      linkedin?: string;
      telegram?: string;
      github: string;
    };
  };
}

const About = ({ aboutPerson }: AboutDetails) => {
  const { name, job, about, avatar, contacts } = aboutPerson;

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
          <div className="about__contacts">
            {Object.entries(contacts).map(([key, value]) => (
              <a
                key={key}
                href={`${
                  Object.entries(CONTACTS_BASE_URLS).find(
                    ([contact]) => contact === key
                  )[1]
                }${value}`}
                rel="noreferrer"
                target="_blank"
              >
                <ContactsIcon id={key} />
              </a>
            ))}
          </div>
        </div>
        <div className="about__line"></div>
        <div className="about__job">{job}</div>
        <div className="about__text">{about}</div>
      </div>
    </div>
  );
};
export default About;
