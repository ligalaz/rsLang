import { useDispatch } from "react-redux";
import { bindActionCreators } from "@reduxjs/toolkit";
import { sprintActions } from "../store/sprint-slice";

const actions = {
  ...sprintActions,
};

export const useActions = () => {
  const dispatch = useDispatch();
  return bindActionCreators(actions, dispatch);
};
