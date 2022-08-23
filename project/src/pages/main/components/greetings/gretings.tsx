import React from "react";
import "./greetings.scss";

function Greetings() {
  return (
    <div className="greetings">
      <div className="greetings__container">
        <div className="greeting__figure1"></div>
        <div className="greeting__figure2"></div>
        <div className="greeting__figure3"></div>
        <div className="greeting__figure4"></div>
        <div className="greeting__figure5"></div>
        <div className="greeting__figure6"></div>
        <div className="greeting__figure7"></div>
      </div>
      <div className="greetings__text">HELLO, Elena!</div>
      <p>Let’s play!</p>
    </div>
  );
}

export default Greetings;
