import React from "react";

interface OptionsProps {
  counter: number;
}

const OptionsComponent = (props: OptionsProps) => {
  return (
    <>
      {Array(props.counter)
        .fill(1)
        .map((_, idx) => (
          <option value={idx} key={idx + 1}>
            {idx}
          </option>
        ))}
    </>
  );
};

export default OptionsComponent;
