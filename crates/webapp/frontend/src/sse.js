// SSE consumption over fetch's body reader (spec §3.3).
//
// Native EventSource cannot send the Firebase Bearer header, so streams are
// consumed via fetch() + response.body.getReader(). Parser contract frozen by
// spec: buffer decoded text, split on newlines, strip the `data:` prefix,
// JSON.parse each line, skip blank/malformed lines without crashing (unknown
// types flow through and are ignored downstream).

/**
 * Drains an SSE Response to completion, invoking `onEvent(obj)` per frame.
 * Resolves `"completed"` when the server closed the stream cleanly,
 * `"lost"` when the read failed mid-flight (network cut, tab hidden kill).
 */
export async function consumeSse(res, onEvent) {
  let reader;
  try {
    reader = res.body.getReader();
  } catch {
    return "lost";
  }
  const decoder = new TextDecoder();
  let buffer = "";
  try {
    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });
      let nl;
      while ((nl = buffer.indexOf("\n")) >= 0) {
        const line = buffer.slice(0, nl).replace(/\r$/, "");
        buffer = buffer.slice(nl + 1);
        // Only `data:` frames carry payloads; blanks/comments are skipped.
        if (!line.startsWith("data:")) continue;
        const payload = line.slice(5).trim();
        if (!payload) continue;
        try {
          onEvent(JSON.parse(payload));
        } catch {
          // Malformed line: skip it, never crash the renderer (§3.3).
        }
      }
    }
    return "completed";
  } catch {
    return "lost";
  }
}
