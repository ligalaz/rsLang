import React from "react";
import { createRoot } from "react-dom/client";
import "./index.scss";
import App from "./App";
import { setupStore } from "./store/store";
import { Provider } from "react-redux";

export const store = setupStore();

const root = createRoot(document.getElementById("root") as HTMLElement);

root.render(
  <Provider store={store}>
    <App />
  </Provider>
);
