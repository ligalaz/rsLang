import React from "react";
import "./about-us.scss";
import Icon from "../../../../components/icon/icon";

function AboutUs() {
  return (
    <>
      <div className="page">
        <div className="page__descr">About us</div>
        <div className="page__line"></div>
      </div>
      <div className="about">
        <div className="about__flex">
          <div className="about__column">
            <Icon type="icon" width={100} height={100} />
            <div className="about__descr">
              <div className="about__title">Alexey</div>
              <div className="about__line"></div>
              <div className="about__job">developer</div>
              <div className="about__text">TextBook, routes</div>
            </div>
          </div>
          <div className="about__column">
            <Icon type="icon" width={100} height={100} />
            <div className="about__descr">
              <div className="about__title">Artem Mikula</div>
              <div className="about__line"></div>
              <div className="about__job">developer</div>
              <div className="about__text">AudioGame</div>
            </div>
          </div>
          <div className="about__column">
            <Icon type="icon" width={100} height={100} />
            <div className="about__descr">
              <div className="about__title">Evgenia Zhadan</div>
              <div className="about__line"></div>
              <div className="about__job">developer</div>
              <div className="about__text">Sprint</div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default AboutUs;
