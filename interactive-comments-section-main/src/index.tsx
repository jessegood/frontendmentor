/* @refresh reload */
import { render } from "solid-js/web";

import "./index.css";
import App from "./App";
import { CurrentUserProvider } from "./Store/CurrentUserProvider";

render(
  () => (
    <CurrentUserProvider>
      <App />
    </CurrentUserProvider>
  ),
  document.getElementById("root") as HTMLElement
);
