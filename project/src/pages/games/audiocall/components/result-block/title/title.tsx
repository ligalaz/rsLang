import React from "react";
import "./title.scss";

interface TitleDetails {
  className?: string;
  children?: JSX.Element | string;
}

const Title = ({ className, children }: TitleDetails): JSX.Element => {
  return <h2 className={`results-title ${className}`}>{children}</h2>;
};

export default Title;
