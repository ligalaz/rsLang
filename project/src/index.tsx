import React from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";
import { setupStore } from "./store/store";
import { Provider } from "react-redux";

export const store = setupStore();

const root = createRoot(document.getElementById("root"));

root.render(
  <Provider store={store}>
    <App />
  </Provider>
);
