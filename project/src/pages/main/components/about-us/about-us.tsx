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
            <Icon type="icon" width={182} height={182} />
            <div className="about__descr">
              <div className="about__title">some</div>
              <div className="about__line"></div>
              <div className="about__job">developer</div>
              <div className="about__text">
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolores
                unde ut dolorum ratione praesentium quaerat eveniet soluta, nam
                distinctio ad.
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default AboutUs;
