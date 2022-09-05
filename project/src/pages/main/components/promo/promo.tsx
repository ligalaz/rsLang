import React from "react";
import "./promo.scss";

const Promo = (): JSX.Element => {
  return (
    <div className="page">
      <div className="page__descr">Promo</div>
      <div className="page__line promo__page-line"></div>
      <div className="promo">
        <p className="promo--purple">Tired of the boring textbook exercises?</p>
        <p className="promo--purple">Don&apos;t know how and where to start?</p>
        <p>
          We have a solution - the RSLang app from our development team!
          It&apos;s a great way to get language practice that you won&apos;t
          find in school lessons, for example:
        </p>
        <ul className="promo__list">
          <li className="promo__item">
            <span className="promo__item-text">Learn colloquial English.</span>
          </li>
          <li className="promo__item">
            <span className="promo__item-text">
              Make a personalised list of difficult words to pay special
              attention to.
            </span>
          </li>
          <li className="promo__item">
            <span className="promo__item-text">
              The core of our app has 3 exciting and entertaining mini-games
              such as: &quot;Savanna&quot;, &quot;Audio Call&quot;,
              &quot;Sprint&quot;, that will not only help you have a good time,
              but also improve your vocabulary and pronunciation.
            </span>
          </li>
          <li className="promo__item">
            <span className="promo__item-text">
              You can keep track of your progress on a single day or over the
              whole learning period
            </span>
          </li>
        </ul>
        <p>
          Have fun and practise your English. No matter what you interests and
          how you spend your time, our mini-games surely have something you
          like.
        </p>
        <p className="promo--red">
          Play, enjoy and don&apos;t be afraid to make mistakes!
        </p>
        <div className="promo__test-user">
          Test user
          <div>login: a@a.com</div>
          <div>password: 11111111</div>
        </div>
        <div className="promo__video">
          <iframe
            width="560"
            height="315"
            src="https://www.youtube.com/embed/79ZZ3a8nQrM"
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      </div>
    </div>
  );
};

export default Promo;
