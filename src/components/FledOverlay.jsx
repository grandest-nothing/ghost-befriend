import Pic from "./Pic.jsx";
import { chancePct } from "../lib.js";
import "../fled.css";

// Shown when a bond fails: the ghost shakes, puffs away and is gone.
export default function FledOverlay({ g, onKeep }) {
  return (
    <div className="fled" role="dialog" aria-modal="true" aria-label={`${g.name} ran away`}>
      <div className="fled-art">
        <Pic g={g} />
        <span className="fled-puff p1" aria-hidden="true">💨</span>
        <span className="fled-puff p2" aria-hidden="true">💨</span>
      </div>
      <p className="fled-kick">OOPS...</p>
      <h1 className="fled-title">{g.name} ran away...</h1>
      <p className="fled-sub">The bond did not take. It slipped into the dark and vanished.</p>
      <div className="fled-odds">🍀 You had a {chancePct(g)}% chance</div>
      <p className="muted">Tip: friendly, low-fear ghosts are much easier to bond with.</p>
      <button className="cta" onClick={onKeep}>KEEP SWIPING</button>
    </div>
  );
}
