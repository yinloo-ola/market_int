/* Ticket 15 tracer entry — composition only; components live in modules.
   Parallel workstream slots (tickets 16/17/18) replace marked regions in
   App.jsx, never this file. */

import { render } from "solid-js/web";
import App from "./App";
import "./style.css";

render(() => <App />, document.getElementById("root"));
