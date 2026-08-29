// Access panel (ticket 22): owner-controlled grant management in the app —
// add or remove an allowed email from the phone, no GCS file editing. The
// server rewrites the live grant file, so changes apply immediately.
// Modal dialog: backdrop click, Escape, or Close all dismiss it.

import { For, Show, createSignal, onCleanup, onMount } from "solid-js";
import { addGrant, getGrants, removeGrant } from "../api";

export default function AccessPanel(props) {
  // props.onClose — dismiss handler (backdrop / Escape / Close button).
  const [fileGrants, setFileGrants] = createSignal([]);
  const [staticEmails, setStaticEmails] = createSignal([]);
  const [draft, setDraft] = createSignal("");
  const [busy, setBusy] = createSignal(false);
  const [error, setError] = createSignal("");

  const apply = (v) => {
    setFileGrants(v?.file_grants ?? []);
    setStaticEmails(v?.static_emails ?? []);
  };

  const refresh = async () => {
    try {
      apply(await getGrants());
    } catch {
      setError("Could not load the grant list.");
    }
  };
  onMount(refresh);

  const onKey = (e) => {
    if (e.key === "Escape") props.onClose();
  };
  onMount(() => {
    window.addEventListener("keydown", onKey);
    onCleanup(() => window.removeEventListener("keydown", onKey));
    const input = document.querySelector(".access-add input");
    input?.focus();
  });

  const add = async (e) => {
    e.preventDefault();
    if (busy() || !draft().trim()) return;
    setBusy(true);
    setError("");
    try {
      apply(await addGrant(draft()));
      setDraft("");
    } catch (err) {
      setError(err.message);
    }
    setBusy(false);
  };

  const remove = async (email) => {
    if (busy()) return;
    setBusy(true);
    setError("");
    try {
      apply(await removeGrant(email));
    } catch (err) {
      setError(err.message);
    }
    setBusy(false);
  };

  return (
    <div class="modal-backdrop" onClick={props.onClose}>
      <div
        class="gate-card access-card"
        role="dialog"
        aria-modal="true"
        aria-label="Access control"
        onClick={(e) => e.stopPropagation()}
      >
        <h1 class="gate-title">Access control</h1>
        <p class="gate-note">
          Emails allowed to use this webapp. Changes apply immediately.
        </p>

        <Show when={error()}>
          <div class="gate-error" role="alert">
            {error()}
          </div>
        </Show>

        <For each={fileGrants()}>
          {(email) => (
            <div class="access-row">
              <span class="access-email">{email}</span>
              <button
                type="button"
                class="access-remove"
                title={`Remove ${email}`}
                aria-label={`Remove ${email}`}
                disabled={busy()}
                onClick={() => remove(email)}
              >
                ✕
              </button>
            </div>
          )}
        </For>
        <Show when={fileGrants().length === 0}>
          <p class="gate-note">No grant-file entries yet.</p>
        </Show>

        <form class="access-add" onSubmit={add}>
          <input
            type="email"
            placeholder="new.email@host"
            aria-label="email to allow"
            value={draft()}
            onInput={(e) => setDraft(e.currentTarget.value)}
            required
          />
          <button type="submit" class="btn btn-primary" disabled={busy()}>
            {busy() ? "…" : "Add"}
          </button>
        </form>

        <Show when={staticEmails().length > 0}>
          <p class="gate-note">
            Also allowed via WEBAPP_OWNER_EMAILS: {staticEmails().join(", ")}
          </p>
        </Show>

        <button
          type="button"
          class="btn"
          style={{ "margin-top": "12px", width: "100%" }}
          onClick={props.onClose}
        >
          Close
        </button>
      </div>
    </div>
  );
}
