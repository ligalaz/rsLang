import React from "react";
import Icon from "../../../../components/icon/icon";
import { CONTACTS_BASE_URLS } from "../../../../config";
import { ContactsIcon } from "../../../../components/icon/contacts-icon";
import "./footer.scss";

const { github } = CONTACTS_BASE_URLS;
const LINKS = [
  {
    path: "https://rs.school/js/",
    id: "rs-school",
    iconClassName: "rss-logo",
  },
  {
    path: `${github}ligalaz/rsLang`,
    id: "github",
    iconClassName: "footer__contact-icon footer__contact-icon--gray",
  },
];

const developersGithubNames = [
  ["ligalaz", "purple"],
  ["intellectualdarknet", "red"],
  ["zhadan93", "yellow"],
];

const { target, rel } = {
  target: "_blank",
  rel: "noopener noreferrer",
};

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer__container">
        <span className="year"> © 2022 RS Lang</span>
        <ul className="footer__list">
          {LINKS.map(({ path, id, iconClassName }) => (
            <li key={id}>
              <a target={target} rel={rel} href={path}>
                <ContactsIcon id={id} className={iconClassName} />
              </a>
            </li>
          ))}
        </ul>
        <address className="developers">
          <ul className="footer__list">
            {developersGithubNames.map(([name, className]) => (
              <li key={name}>
                <a
                  className="developers__link"
                  target={target}
                  rel={rel}
                  href={`${github}${name}`}
                >
                  <ContactsIcon
                    id="github"
                    className={`footer__contact-icon footer__contact-icon--${className}`}
                  />
                </a>
              </li>
            ))}
          </ul>
        </address>
      </div>
    </footer>
  );
}
