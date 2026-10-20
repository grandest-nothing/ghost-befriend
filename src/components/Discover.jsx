import { useRef, useState } from "react";
import { GRAD, dots, label, isBeginner, isHighRisk } from "../lib.js";
import Pic from "./Pic.jsx";

export function Chips({ g }) {
  return (
    <div className="chips">
      <span className="chip">📍 {g.distance} km</span>
      <span className="chip">💜 {g.friendliness}%</span>
      <span className="chip">🔗 {dots(g.difficulty)}</span>
    </div>
  );
}

const stop = (e) => e.stopPropagation();

function SwipeCard({ g, leaving, trigger, onOpen, shortlisted, onShortlist }) {
  const [dx, setDx] = useState(0);
  const [drag, setDrag] = useState(false);
  const sx = useRef(0);
  const moved = useRef(false);
  const down = (e) => { sx.current = e.clientX; moved.current = false; setDrag(true); e.currentTarget.setPointerCapture(e.pointerId); };
  const move = (e) => {
    if (!drag) return;
    const d = e.clientX - sx.current;
    if (Math.abs(d) > 6) moved.current = true;
    setDx(d);
  };
  const up = () => {
    setDrag(false);
    if (Math.abs(dx) > 110) { const dir = dx > 0 ? 1 : -1; setDx(0); trigger(dir); }
    else { setDx(0); if (!moved.current) onOpen(); }
  };
  const x = leaving ? leaving * 700 : dx;
  return (
    <article
      className="card"
      style={{ background: GRAD(g), transform: `translateX(${x}px) rotate(${x / 20}deg)`, transition: drag ? "none" : "transform .23s ease" }}
      onPointerDown={down} onPointerMove={move} onPointerUp={up} onPointerCancel={up}
    >
      <div className="stamp yes" style={{ opacity: Math.min(Math.max(x, 0) / 110, 1) }}>BEFRIEND</div>
      <div className="stamp no" style={{ opacity: Math.min(Math.max(-x, 0) / 110, 1) }}>IGNORE</div>
      <div className="hero" style={{ filter: `drop-shadow(0 0 40px ${g.color})` }}><Pic g={g} /></div>
      <div className="info">
        <div className="label">{label(g)}</div>
        <div className="namerow">
          <h2>{g.name} <small>{g.years}</small></h2>
          <button className="heart" onPointerDown={stop} onPointerUp={stop} onClick={onShortlist} aria-label="Shortlist">{shortlisted ? "♥" : "♡"}</button>
        </div>
        <div className="loc">📍 {g.location}</div>
        <div className="chips">{g.elements.map((e) => <span key={e} className="chip">✨ {e}</span>)}</div>
        <Chips g={g} />
        {g.uncontrollable && <div className="flag">⚠ Cannot be controlled once bonded</div>}
      </div>
    </article>
  );
}

export default function Discover({ queue, feed, setFeed, canUndo, onUndo, onFilter, filtersActive, onSwipe, onOpen, shortlist, onShortlist, notes, onReset }) {
  const [leaving, setLeaving] = useState(0);
  const g = queue[0];
  const trigger = (dir) => {
    if (leaving || !g) return;
    setLeaving(dir);
    setTimeout(() => { setLeaving(0); onSwipe(dir > 0 ? "right" : "left", g); }, 230);
  };
  return (
    <div className="stage">
      <div className="cardwrap">
        {g ? (
          <SwipeCard key={g.id} g={g} leaving={leaving} trigger={trigger} onOpen={() => onOpen(g)} shortlisted={shortlist.includes(g.id)} onShortlist={() => onShortlist(g.id)} />
        ) : (
          <div className="empty">
            <div className="hero small">🌙</div>
            <h2>No more ghosts here</h2>
            <p className="muted">Change your filters or start over.</p>
            <button className="cta" onClick={onReset}>RESET EVERYTHING</button>
          </div>
        )}
        <div className="topbar">
          <button className="circle" disabled={!canUndo} onClick={onUndo} aria-label="Undo">‹</button>
          <div className="seg">
            <button className={feed === "foryou" ? "on" : ""} onClick={() => setFeed("foryou")}>FOR YOU</button>
            <button className={feed === "nearby" ? "on" : ""} onClick={() => setFeed("nearby")}>NEARBY</button>
          </div>
          <button className={`circle ${filtersActive ? "dot" : ""}`} onClick={onFilter} aria-label="Filters">⚙</button>
        </div>
        {g && <div className="progress">{Array.from({ length: Math.min(queue.length, 4) }).map((_, i) => <i key={i} className={i === 0 ? "on" : ""} />)}</div>}
        {g && <div className="notes">{notes.map((n) => <span key={n.text} className={`note ${n.cls}`}>{n.text}</span>)}</div>}
      </div>
      <div className="bar">
        <button className="b-ignore" disabled={!g} onClick={() => trigger(-1)} aria-label="Ignore">💔</button>
        <button className="b-info" disabled={!g} onClick={() => onOpen(g)} aria-label="Details">💬</button>
        <button className="b-yes" disabled={!g} onClick={() => trigger(1)} aria-label="Befriend">❤</button>
      </div>
    </div>
  );
}

export function Details({ g, shortlisted, comparing, befriended, onShortlist, onCompare, onIgnore, onBefriend, onClose }) {
  const archive = [[<Pic key="p" g={g} />, "First sighting"], ["🌙", `Last seen · ${g.location}`], ["🕯️", `${g.haunting}`]];
  // backgroundImage + backgroundColor (not the `background` shorthand) keeps a solid dark base under the gradient,
  // so the screen underneath can never show through.
  return (
    <div className="details" style={{ backgroundImage: GRAD(g), backgroundColor: "#0b0710" }}>
      <div className="hero faded" style={{ opacity: 0.16 }}><Pic g={g} /></div>
      <div className="topbar">
        <button className="circle" onClick={onClose} aria-label="Back">‹</button>
        <div className="seg"><button className="on">DETAILS</button></div>
        <button className={`circle ${comparing ? "dot" : ""}`} onClick={onCompare} aria-label="Compare">⇄</button>
      </div>
      <div className="dscroll">
        <div className="label">{label(g)}</div>
        <div className="namerow">
          <h2 className="big">{g.name} <small>{g.years}</small></h2>
          <button className="heart" onClick={onShortlist} aria-label="Shortlist">{shortlisted ? "♥" : "♡"}</button>
        </div>
        <div className="loc">📍 {g.location}</div>
        <Chips g={g} />
        <h3>About</h3>
        <p>{g.description}</p>
        {isHighRisk(g) && <p className="flag">High-risk ghost: requires approval before bonding.</p>}
        {g.uncontrollable && <p className="flag">Some ghosts cannot be controlled once bonded, and this is one of them.</p>}
        {isBeginner(g) && <p className="okline">Recommended for first-time users.</p>}
        <h3>More info</h3>
        <div className="chips wrap">
          <span className="chip">👤 {g.type}</span>
          {g.elements.map((e) => <span key={e} className="chip">✨ {e}</span>)}
          <span className="chip">🌀 {g.haunting}</span>
          <span className="chip">😨 fear {g.fear}</span>
          <span className="chip">🎛️ {g.uncontrollable ? "uncontrollable" : "controllable"}</span>
          <span className="chip">🕰️ haunting {g.years} yrs</span>
        </div>
        <h3>Archive</h3>
        <div className="archive">
          {archive.map(([e, t]) => <div key={t} className="tile" style={{ backgroundImage: GRAD(g), backgroundColor: "#0b0710" }}><span>{e}</span><small>{t}</small></div>)}
        </div>
      </div>
      <div className="bar">
        <button className="b-ignore" onClick={onIgnore} aria-label="Ignore">💔</button>
        <button className="b-info" onClick={onShortlist} aria-label="Shortlist">{shortlisted ? "★" : "☆"}</button>
        <button className="b-yes" disabled={befriended} onClick={onBefriend} aria-label="Befriend">{befriended ? "FRIENDS" : "❤"}</button>
      </div>
    </div>
  );
}
