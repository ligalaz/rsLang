import { useDispatch } from "react-redux";
import { bindActionCreators } from "@reduxjs/toolkit";
import { sprintActions } from "../store/sprint-slice";
import { sprintSettingsActions } from "../store/sprint-settings-slice";

const actions = {
  ...sprintActions,
  ...sprintSettingsActions,
};

export const useActions = () => {
  const dispatch = useDispatch();
  return bindActionCreators(actions, dispatch);
};
