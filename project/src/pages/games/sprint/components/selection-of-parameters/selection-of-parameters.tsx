import React from "react";
import "./selection-of-parameters.scss";

interface SelectionDetails {
  selectionDetails: {
    label: string;
    optionCount: number;
  };
  value?: string;
  setValue?: (value: string) => void;
  isDisabled?: boolean;
}

const SelectionOfParameters = ({
  selectionDetails,
  value,
  setValue,
  isDisabled,
}: SelectionDetails): JSX.Element => {
  const { label, optionCount } = selectionDetails;

  return (
    <label className="label">
      {label}
      <select
        value={value}
        className={`selection__list ${
          isDisabled && "selection__list--disabled"
        }`}
        onChange={(event) => setValue(event.target.value)}
        disabled={isDisabled}
      >
        {[...new Array(optionCount)].map((_, index) => {
          const value = index + 1;
          return (
            <option key={value} className="selection__item">
              {value}
            </option>
          );
        })}
      </select>
    </label>
  );
};

export default SelectionOfParameters;
