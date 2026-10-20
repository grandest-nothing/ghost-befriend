import { useMemo, useState } from "react";
import { GRAD, dots, isHighRisk } from "../lib.js";
import Pic from "./Pic.jsx";
import "../nearby.css";

const RANGES = [5, 10, 30];

// Radar math: distance -> radius (0.14..0.44 of the radar size), angle spread with the golden angle.
const radius = (d, range) => 0.14 + 0.3 * Math.sqrt(Math.min(d, range) / range);
const place = (g, range) => {
  const r = radius(g.distance, range);
  const a = (g.id * 137.5 * Math.PI) / 180;
  return { left: `${50 + r * 100 * Math.cos(a)}%`, top: `${50 + r * 100 * Math.sin(a)}%` };
};

export default function Nearby({ ghosts, feed, setFeed, onOpen, onBefriend, onFilter, filtersActive }) {
  const [range, setRange] = useState(10);
  const [selId, setSelId] = useState(null);

  const inRange = useMemo(
    () => [...ghosts].filter((g) => g.distance <= range).sort((a, b) => a.distance - b.distance),
    [ghosts, range]
  );
  const sel = inRange.find((g) => g.id === selId) || inRange[0];

  return (
    <div className="nearby">
      <div className="nb-top">
        <div className="seg">
          <button className={feed === "foryou" ? "on" : ""} onClick={() => setFeed("foryou")}>FOR YOU</button>
          <button className={feed === "nearby" ? "on" : ""} onClick={() => setFeed("nearby")}>NEARBY</button>
        </div>
        <button className={`circle ${filtersActive ? "dot" : ""}`} onClick={onFilter} aria-label="Filters">⚙</button>
      </div>

      <div className="nb-title">
        <h1>Ghost radar</h1>
        <p className="muted">{inRange.length} ghost{inRange.length === 1 ? "" : "s"} within {range} km</p>
      </div>

      <div className="nb-ranges">
        {RANGES.map((r) => (
          <button key={r} className={range === r ? "on" : ""} onClick={() => { setRange(r); setSelId(null); }}>{r} km</button>
        ))}
      </div>

      <div className="radar" role="group" aria-label="Ghost radar">
        <div className="sweep" />
        {[0.25, 0.5, 1].map((f) => {
          const d = range * f;
          const size = radius(d, range) * 200;
          return (
            <div key={f} className="ring-line" style={{ width: `${size}%`, height: `${size}%` }}>
              <span>{Number.isInteger(d) ? d : d.toFixed(1)} km</span>
            </div>
          );
        })}
        <div className="radar-me" aria-label="You">🧑</div>
        {inRange.map((g) => (
          <button
            key={g.id}
            className={`blip ${sel?.id === g.id ? "on" : ""} ${isHighRisk(g) ? "risk" : ""}`}
            style={place(g, range)}
            onClick={() => setSelId(g.id)}
            aria-label={`${g.name}, ${g.distance} km`}
          >
            <Pic g={g} />
          </button>
        ))}
      </div>

      {inRange.length === 1 && <div className="nb-note">Only 1 ghost left in your area.</div>}

      {sel ? (
        <div className="nb-card" style={{ background: GRAD(sel) }}>
          <Pic g={sel} />
          <div className="grow">
            <h3>{sel.name} <small>{sel.years}</small></h3>
            <p className="nb-meta">📍 {sel.distance} km · {sel.location} · {dots(sel.difficulty)}</p>
            <div className="chips">
              <span className="chip">{sel.type}</span>
              <span className="chip">fear {sel.fear}</span>
              {sel.elements.map((e) => <span key={e} className="chip">✨ {e}</span>)}
            </div>
            {isHighRisk(sel) && <p className="flag">High risk: approval required</p>}
            <div className="nb-actions">
              <button className="btn small" onClick={() => onOpen(sel)}>Details</button>
              <button className="cta small" onClick={() => onBefriend(sel)}>❤ Befriend</button>
            </div>
          </div>
        </div>
      ) : (
        <p className="muted pad">No ghosts within {range} km. Try a wider range or clear your filters.</p>
      )}

      {inRange.length > 0 && (
        <div className="nb-list">
          <h3>Closest to you</h3>
          {inRange.map((g) => (
            <div key={g.id} className={`nb-row ${sel?.id === g.id ? "on" : ""}`} onClick={() => setSelId(g.id)}>
              <Pic g={g} />
              <div className="grow"><b>{g.name}</b><small>{g.location} · fear {g.fear}</small></div>
              <span className="km">{g.distance} km</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
