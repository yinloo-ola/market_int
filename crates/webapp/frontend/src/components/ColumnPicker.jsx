// Column picker (spec §6.3): flat 3-column checkbox grid of the 26
// togglable columns (`side` omitted — constant "put"), `Reset defaults`
// link. State itself lives in the shared column store in App.jsx so both
// tabs see the same set and it persists to localStorage.

import { For, Show, createSignal } from "solid-js";

import { COLUMNS } from "../lib/columns";

export default function ColumnPicker(props) {
  // props.store = { visible(), isOn(id), toggle(id), reset() }
  const [open, setOpen] = createSignal(false);
  return (
    <span class="colpicker">
      <button
        type="button"
        class="tool-btn"
        aria-expanded={open()}
        onClick={() => setOpen(!open())}
      >
        columns ▾
      </button>
      <Show when={open()}>
        {/* invisible backdrop closes on any outside click */}
        <div class="pop-backdrop" onClick={() => setOpen(false)} />
        <div class="picker-panel" role="menu" aria-label="visible columns">
          <div class="picker-grid">
            <For each={COLUMNS}>
              {(c) => (
                <label class="pick-item">
                  <input
                    type="checkbox"
                    checked={props.store.isOn(c.id)}
                    onChange={(e) =>
                      props.store.toggle(c.id, e.currentTarget.checked)
                    }
                  />
                  {c.label}
                </label>
              )}
            </For>
          </div>
          <button
            type="button"
            class="linklike"
            onClick={() => props.store.reset()}
          >
            Reset defaults
          </button>
        </div>
      </Show>
    </span>
  );
}
