import React from "react";
import "./greetings.scss";
import Icon from "../../../../components/icon/icon";
import { RootState, useAppSelector } from "../../../../store/store";

function Greetings() {
  const name: string = useAppSelector(
    (state: RootState) => state.authState.auth?.name
  );

  return (
    <div className="greetings">
      <div className="greetings__container">
        <Icon type="greetings" />
      </div>
      <div className="greetings__text">HELLO, {name ?? "Student1"}!</div>
    </div>
  );
}

export default Greetings;
