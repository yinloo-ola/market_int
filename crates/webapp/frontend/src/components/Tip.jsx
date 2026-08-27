// CSS-hover tooltip wrapper (spec §6.5): the pill renders BELOW the label so
// the sticky table header never clips it. Pure CSS — no portals, no JS.

export default function Tip(props) {
  // props.text (plain string), props.children — the labelled element(s).
  return (
    <span class="tip" data-tip={props.text ?? ""}>
      {props.children}
    </span>
  );
}
