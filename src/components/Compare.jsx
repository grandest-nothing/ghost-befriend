import { useMemo, useState } from "react";
import { GRAD, dots, isHighRisk } from "../lib.js";
import Pic from "./Pic.jsx";
import "../compare.css";

const FEAR = { low: 1, medium: 2, high: 3 };

// best: which direction wins in that row (the winner is highlighted in green)
const ROWS = [
  { label: "Friendliness", get: (g) => g.friendliness, show: (g) => `${g.friendliness}%`, best: "max" },
  { label: "Fear level", get: (g) => FEAR[g.fear], show: (g) => g.fear, best: "min" },
  { label: "Bond difficulty", get: (g) => g.difficulty, show: (g) => dots(g.difficulty), best: "min" },
  { label: "Distance", get: (g) => g.distance, show: (g) => `${g.distance} km`, best: "min" },
  { label: "Controllable", get: (g) => (g.uncontrollable ? 0 : 1), show: (g) => (g.uncontrollable ? "No" : "Yes"), best: "max" },
  { label: "Approval needed", get: (g) => (isHighRisk(g) ? 1 : 0), show: (g) => (isHighRisk(g) ? "Yes" : "No"), best: "min" },
];

function Picker({ ghosts, compare, shortlist, toggle, onClose }) {
  const [q, setQ] = useState("");
  const list = useMemo(
    () =>
      ghosts
        .filter((g) => g.name.toLowerCase().includes(q.trim().toLowerCase()))
        .sort((a, b) => Number(shortlist.includes(b.id)) - Number(shortlist.includes(a.id)) || a.name.localeCompare(b.name)),
    [ghosts, q, shortlist]
  );
  return (
    <div className="overlay" onClick={onClose}>
      <div className="sheet picker" onClick={(e) => e.stopPropagation()}>
        <div className="pk-head">
          <h2>Choose ghosts</h2>
          <button className="cta small" onClick={onClose}>Done</button>
        </div>
        <p className="muted">{compare.length} of 3 selected · ★ = on your shortlist</p>
        <input className="search" placeholder="🔍 Search by name" value={q} onChange={(e) => setQ(e.target.value)} />
        <div className="pk-list">
          {list.map((g) => {
            const on = compare.includes(g.id);
            const full = !on && compare.length >= 3;
            return (
              <button key={g.id} className={`pk-row ${on ? "on" : ""}`} disabled={full} onClick={() => toggle(g.id)}>
                <Pic g={g} className="sm" />
                <span className="grow"><b>{g.name}</b><small>{g.type} · fear {g.fear}</small></span>
                {shortlist.includes(g.id) && <span className="star">★</span>}
                <span className="tick">{on ? "✓" : ""}</span>
              </button>
            );
          })}
          {list.length === 0 && <p className="muted pad">No ghost with that name.</p>}
        </div>
      </div>
    </div>
  );
}

export default function Compare({ ghosts, compare, shortlist, toggle, onClear }) {
  const [open, setOpen] = useState(false);
  const picked = compare.map((id) => ghosts.find((g) => g.id === id)).filter(Boolean);
  const slots = [0, 1, 2].map((i) => picked[i] || null);
  const easiest = picked.length >= 2
    ? [...picked].sort((a, b) => a.difficulty - b.difficulty || FEAR[a.fear] - FEAR[b.fear] || b.friendliness - a.friendliness)[0]
    : null;

  return (
    <div className="page cmp">
      <header className="ph">
        <h1>Compare</h1>
        {picked.length > 0 && <button className="btn small" onClick={onClear}>Clear</button>}
      </header>

      <div className="cmp-slots">
        {slots.map((g, i) =>
          g ? (
            <div key={g.id} className="cmp-slot filled" style={{ backgroundImage: GRAD(g), backgroundColor: "#0b0710" }}>
              <button className="x" onClick={() => toggle(g.id)} aria-label={`Remove ${g.name}`}>✕</button>
              <Pic g={g} />
              <b>{g.name}</b>
            </div>
          ) : (
            <button key={`empty-${i}`} className="cmp-slot empty" onClick={() => setOpen(true)}>
              <span>+</span>
              <small>Add ghost</small>
            </button>
          )
        )}
      </div>

      {picked.length < 2 ? (
        <p className="muted cmp-hint">Pick 2 or 3 ghosts to see them side by side.</p>
      ) : (
        <>
          {easiest && <div className="cmp-pick">⭐ Easiest first bond: <b>{easiest.name}</b></div>}
          <div className="cmp-table">
            {ROWS.map((r) => {
              const vals = picked.map(r.get);
              const best = r.best === "max" ? Math.max(...vals) : Math.min(...vals);
              const tie = vals.every((v) => v === vals[0]);
              return (
                <div className="cmp-row" key={r.label}>
                  <span className="cmp-label">{r.label}</span>
                  <div className="cmp-cells">
                    {slots.map((g, i) =>
                      g ? (
                        <span key={g.id} className={`cmp-cell ${!tie && r.get(g) === best ? "win" : ""}`}>{r.show(g)}</span>
                      ) : (
                        <span key={`b-${i}`} className="cmp-cell blank" />
                      )
                    )}
                  </div>
                </div>
              );
            })}
          </div>
          <p className="muted cmp-hint">Green marks the best value in each row.</p>
        </>
      )}

      {open && <Picker ghosts={ghosts} compare={compare} shortlist={shortlist} toggle={toggle} onClose={() => setOpen(false)} />}
    </div>
  );
}
