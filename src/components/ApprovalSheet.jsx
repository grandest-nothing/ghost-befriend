import Pic from "./Pic.jsx";
import { chancePct } from "../lib.js";
import "../approval.css";

// One-tap confirmation for high-risk ghosts: no checkbox, no typing.
export default function ApprovalSheet({ g, onCancel, onApprove }) {
  return (
    <div className="overlay" onClick={onCancel}>
      <div
        className="sheet ap"
        role="dialog"
        aria-modal="true"
        aria-label={`Approve bond with ${g.name}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="ap-head">
          <Pic g={g} className="ap-pic" />
          <div>
            <span className="ap-tag">⚠ HIGH RISK</span>
            <h2>{g.name}</h2>
          </div>
        </div>
        <ul className="ap-list">
          <li>🍀 Bond chance: <b>{chancePct(g)}%</b></li>
          <li>😨 Fear level: <b>{g.fear}</b></li>
          <li>👤 Type: <b>{g.type}</b></li>
          {g.uncontrollable && <li>🎛️ Cannot be controlled once bonded</li>}
        </ul>
        <p className="muted">Even with your OK, this ghost might run away.</p>
        <button className="cta" onClick={onApprove}>Approve and try to befriend</button>
        <button className="linkbtn" onClick={onCancel}>Not now</button>
      </div>
    </div>
  );
}
