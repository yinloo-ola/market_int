/* PROTOTYPE entry — dev-only page. Vite's dev server serves any HTML under
   the frontend root by path; `vite build` only builds index.html (and the
   smoke lane builds its own entry), so nothing here can ever ship.
   Renders the real app shell chrome (brand header, tab strip with Holdings
   active) from the production stylesheet so the variants read like the
   finished product. `npm run proto` → http://localhost:5175/holdings-panel-proto.html */

import { render } from "solid-js/web";

import ProtoRoot from "./holdings-panel-proto";
import "../style.css";

function Shell(props) {
  return (
    <div class="shell">
      <h1 class="brand">
        <span class="brand-mark">
          Market<span class="brand-accent">Int</span>
        </span>
        <span class="brand-sub">Put-Selling Candidates</span>
      </h1>
      <nav class="tabs" role="tablist" aria-label="timeframes">
        <button type="button" class="tab" disabled title="prototype — Holdings only">
          Short · 5-day
        </button>
        <button type="button" class="tab" disabled title="prototype — Holdings only">
          Medium · 20-day
        </button>
        <button type="button" role="tab" aria-selected="true" class="tab active">
          Holdings
        </button>
      </nav>
      <div class="hp-scroll">{props.children}</div>
    </div>
  );
}

render(
  () => (
    <Shell>
      <ProtoRoot />
    </Shell>
  ),
  document.getElementById("root")
);
