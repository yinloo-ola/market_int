// CSS-hover tooltip wrapper (spec §6.5): the pill renders BELOW the label so
// the sticky table header never clips it. Pure CSS — no portals, no JS —
// except for one measured nudge: a label within ~pill-width of the viewport's
// right edge would push the pill off-screen, so on first pointer/focus entry
// we flip that instance's alignment to grow leftward instead (`.tip-flip`).

export default function Tip(props) {
  // props.text (plain string), props.children — the labelled element(s).
  let el;
  const syncFlip = () => {
    if (!el) return;
    const r = el.getBoundingClientRect();
    const needed = r.right + 352; // 340px pill + margin
    el.classList.toggle(
      "tip-flip",
      needed > window.innerWidth && r.left > 352,
    );
  };
  return (
    <span
      class="tip"
      data-tip={props.text ?? ""}
      ref={el}
      onPointerEnter={syncFlip}
      onFocusIn={syncFlip}
    >
      {props.children}
    </span>
  );
}
