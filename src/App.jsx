import { useEffect, useMemo, useRef, useState } from "react";
import { GHOSTS, LOCATIONS } from "./data/ghosts.js";

const load = (k, d) => { try { return JSON.parse(localStorage.getItem(k)) ?? d; } catch { return d; } };
function usePersist(key, init) {
  const [v, setV] = useState(() => load(key, init));
  useEffect(() => localStorage.setItem(key, JSON.stringify(v)), [key, v]);
  return [v, setV];
}

const isHighRisk = (g) => g.fear === "high" || g.type === "vengeful";
const isBeginner = (g) => g.fear === "low" && g.difficulty <= 2 && !g.uncontrollable;
const stars = (p) => "★".repeat(Math.round(p / 20)) + "☆".repeat(5 - Math.round(p / 20));
const FEAR_RANK = { low: 1, medium: 2, high: 3 };

const SORTS = {
  "friendliness-desc": ["Friendliest first", (a, b) => b.friendliness - a.friendliness],
  "difficulty-asc": ["Easiest bond first", (a, b) => a.difficulty - b.difficulty],
  "difficulty-desc": ["Hardest bond first", (a, b) => b.difficulty - a.difficulty],
};

function Tags({ g }) {
  return (
    <div className="tags">
      <span className={`tag type-${g.type}`}>{g.type}</span>
      {g.elements.map((e) => <span key={e} className="tag el">{e}</span>)}
      <span className={`tag fear-${g.fear}`}>fear: {g.fear}</span>
    </div>
  );
}

function Difficulty({ n }) {
  return <span className="diff" aria-label={`Bond difficulty ${n} of 5`}>{"●".repeat(n)}{"○".repeat(5 - n)}</span>;
}

function SwipeCard({ ghost, onSwipe, onInfo, beginner }) {
  const [dx, setDx] = useState(0);
  const [drag, setDrag] = useState(false);
  const [leaving, setLeaving] = useState(0);
  const startX = useRef(0);

  const fly = (dir) => {
    setLeaving(dir);
    setTimeout(() => { onSwipe(dir > 0 ? "right" : "left"); setLeaving(0); setDx(0); }, 230);
  };
  const down = (e) => { startX.current = e.clientX; setDrag(true); e.currentTarget.setPointerCapture(e.pointerId); };
  const move = (e) => { if (drag) setDx(e.clientX - startX.current); };
  const up = () => {
    setDrag(false);
    if (Math.abs(dx) > 110) fly(dx > 0 ? 1 : -1); else setDx(0);
  };

  const x = leaving ? leaving * 700 : dx;
  const style = {
    transform: `translateX(${x}px) rotate(${x / 18}deg)`,
    transition: drag ? "none" : "transform .23s ease",
    background: `radial-gradient(circle at 50% 22%, ${ghost.color}55, #17141f 62%)`,
  };

  return (
    <div className="deck">
      <div className="card-behind" />
      <article className="card" style={style} onPointerDown={down} onPointerMove={move} onPointerUp={up} onPointerCancel={up}>
        <div className="stamp befriend" style={{ opacity: Math.min(Math.max(x, 0) / 110, 1) }}>BEFRIEND</div>
        <div className="stamp ignore" style={{ opacity: Math.min(Math.max(-x, 0) / 110, 1) }}>IGNORE</div>
        {beginner && <div className="ribbon">Beginner friendly</div>}
        {isHighRisk(ghost) && <div className="ribbon danger">High risk</div>}
        <div className="avatar" style={{ filter: `drop-shadow(0 0 24px ${ghost.color})` }}>{ghost.emoji}</div>
        <h2>{ghost.name}</h2>
        <Tags g={ghost} />
        <p className="desc">{ghost.description}</p>
        <dl className="stats">
          <div><dt>Friendliness</dt><dd>{stars(ghost.friendliness)} {ghost.friendliness}%</dd></div>
          <div><dt>Bond difficulty</dt><dd><Difficulty n={ghost.difficulty} /></dd></div>
          <div><dt>Haunting</dt><dd>{ghost.haunting}</dd></div>
          <div><dt>Location</dt><dd>{ghost.location}</dd></div>
        </dl>
        {ghost.uncontrollable && <p className="warn">⚠ Cannot be controlled once bonded</p>}
      </article>
      <div className="actions">
        <button className="round no" onClick={() => fly(-1)} aria-label="Ignore">✕</button>
        <button className="round info" onClick={onInfo} aria-label="Details">i</button>
        <button className="round yes" onClick={() => fly(1)} aria-label="Befriend">♥</button>
      </div>
    </div>
  );
}

function Modal({ children, onClose, wide }) {
  useEffect(() => {
    const h = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [onClose]);
  return (
    <div className="overlay" onClick={onClose}>
      <div className={`modal ${wide ? "wide" : ""}`} role="dialog" aria-modal="true" onClick={(e) => e.stopPropagation()}>
        <button className="close" onClick={onClose} aria-label="Close">×</button>
        {children}
      </div>
    </div>
  );
}

function Details({ g, shortlisted, comparing, onShortlist, onCompare, onBefriend, befriended }) {
  return (
    <>
      <div className="avatar small">{g.emoji}</div>
      <h2>{g.name}</h2>
      <Tags g={g} />
      <p className="desc">{g.description}</p>
      <ul className="detail-list">
        <li><b>Haunting style:</b> {g.haunting}</li>
        <li><b>Location:</b> {g.location}</li>
        <li><b>Friendliness:</b> {stars(g.friendliness)} ({g.friendliness}%)</li>
        <li><b>Bond difficulty:</b> <Difficulty n={g.difficulty} /></li>
      </ul>
      {isHighRisk(g) && <p className="warn">High-risk ghost: requires approval before bonding.</p>}
      {g.uncontrollable && <p className="warn">Some ghosts cannot be controlled once bonded, and this is one of them.</p>}
      {isBeginner(g) && <p className="ok">Recommended for first-time users.</p>}
      <div className="row">
        <button className="btn" onClick={onShortlist}>{shortlisted ? "★ Shortlisted" : "☆ Shortlist"}</button>
        <button className="btn" onClick={onCompare}>{comparing ? "✓ In compare" : "⇄ Compare"}</button>
        <button className="btn primary" disabled={befriended} onClick={onBefriend}>{befriended ? "Already friends" : "♥ Befriend"}</button>
      </div>
    </>
  );
}

function Compare({ ghosts, onRemove }) {
  if (ghosts.length < 2) return <><h2>Compare ghosts</h2><p className="muted">Pick at least 2 ghosts (max 3) from details or your shortlist.</p></>;
  const rows = [
    ["Type", (g) => g.type], ["Elements", (g) => g.elements.join(" / ")], ["Haunting", (g) => g.haunting],
    ["Fear level", (g) => g.fear], ["Friendliness", (g) => `${stars(g.friendliness)} ${g.friendliness}%`],
    ["Location", (g) => g.location], ["Bond difficulty", (g) => `${g.difficulty} / 5`],
    ["Controllable", (g) => (g.uncontrollable ? "No" : "Yes")], ["Approval needed", (g) => (isHighRisk(g) ? "Yes" : "No")],
  ];
  return (
    <>
      <h2>Compare ghosts</h2>
      <div className="scroll">
        <table>
          <thead><tr><th />{ghosts.map((g) => <th key={g.id}>{g.emoji} {g.name}<br /><button className="link" onClick={() => onRemove(g.id)}>remove</button></th>)}</tr></thead>
          <tbody>{rows.map(([l, f]) => <tr key={l}><th>{l}</th>{ghosts.map((g) => <td key={g.id}>{f(g)}</td>)}</tr>)}</tbody>
        </table>
      </div>
    </>
  );
}

function Approval({ g, onCancel, onApprove }) {
  const [ok, setOk] = useState(false);
  const [text, setText] = useState("");
  const ready = ok && text.trim().toUpperCase() === "APPROVE";
  return (
    <>
      <h2>⚠ Approval required</h2>
      <p><b>{g.name}</b> is a high-risk ghost (fear: {g.fear}, type: {g.type}). {g.uncontrollable ? "It cannot be controlled once bonded. " : ""}A guardian or admin must approve this bond.</p>
      <label className="check"><input type="checkbox" checked={ok} onChange={(e) => setOk(e.target.checked)} /> I understand the risks.</label>
      <input className="input" placeholder='Type "APPROVE" to confirm' value={text} onChange={(e) => setText(e.target.value)} />
      <div className="row">
        <button className="btn" onClick={onCancel}>Cancel</button>
        <button className="btn primary" disabled={!ready} onClick={onApprove}>Approve and befriend</button>
      </div>
    </>
  );
}

export default function App() {
  const [tab, setTab] = useState("discover");
  const [decisions, setDecisions] = usePersist("gb.decisions", {});
  const [shortlist, setShortlist] = usePersist("gb.shortlist", []);
  const [compare, setCompare] = usePersist("gb.compare", []);
  const [fear, setFear] = useState("all");
  const [minFriend, setMinFriend] = useState(0);
  const [location, setLocation] = useState("all");
  const [sort, setSort] = useState("friendliness-desc");
  const [modal, setModal] = useState(null);

  const byId = (id) => GHOSTS.find((g) => g.id === id);
  const friends = Object.keys(decisions).filter((k) => decisions[k] === "befriend").map(Number);
  const firstTime = friends.length === 0;

  const filtered = useMemo(() => {
    let list = GHOSTS.filter((g) =>
      (fear === "all" || g.fear === fear) && g.friendliness >= minFriend && (location === "all" || g.location === location)
    );
    list = [...list].sort(SORTS[sort][1]);
    if (firstTime) list = [...list.filter(isBeginner), ...list.filter((g) => !isBeginner(g))];
    return list;
  }, [fear, minFriend, location, sort, firstTime]);

  const queue = filtered.filter((g) => !decisions[g.id]);
  const current = queue[0];

  const decide = (id, d) => setDecisions((p) => ({ ...p, [id]: d }));
  const tryBefriend = (g) => {
    if (decisions[g.id] === "befriend") return;
    if (isHighRisk(g)) setModal({ kind: "approval", g });
    else { decide(g.id, "befriend"); setModal(null); }
  };
  const toggle = (setter, id, max) => setter((p) => (p.includes(id) ? p.filter((x) => x !== id) : max && p.length >= max ? [...p.slice(1), id] : [...p, id]));
  const reset = () => { setDecisions({}); setShortlist([]); setCompare([]); };

  const onSwipe = (dir) => {
    if (!current) return;
    if (dir === "left") decide(current.id, "ignore");
    else tryBefriend(current);
  };

  const open = (g) => setModal({ kind: "details", g });
  const GhostRow = ({ g, extra }) => (
    <li className="row-item" onClick={() => open(g)}>
      <span className="mini" style={{ background: g.color + "33" }}>{g.emoji}</span>
      <span className="grow"><b>{g.name}</b><small>{g.type} · {g.location} · {g.friendliness}%</small></span>
      {extra}
    </li>
  );

  return (
    <div className="app">
      <header>
        <h1>👻 Ghost Befriend</h1>
        <button className="btn small" onClick={() => setModal({ kind: "compare" })}>Compare ({compare.length})</button>
      </header>

      <nav>
        {[["discover", "Discover"], ["shortlist", `Shortlist (${shortlist.length})`], ["friends", `Friends (${friends.length})`]].map(([k, l]) => (
          <button key={k} className={tab === k ? "active" : ""} onClick={() => setTab(k)}>{l}</button>
        ))}
      </nav>

      <main>
        {tab === "discover" && (
          <>
            <section className="filters">
              <label>Fear
                <select value={fear} onChange={(e) => setFear(e.target.value)}>
                  <option value="all">Any</option><option value="low">Low</option><option value="medium">Medium</option><option value="high">High</option>
                </select>
              </label>
              <label>Friendliness
                <select value={minFriend} onChange={(e) => setMinFriend(Number(e.target.value))}>
                  <option value={0}>Any</option><option value={50}>50%+</option><option value={70}>70%+</option><option value={85}>85%+</option>
                </select>
              </label>
              <label>Location
                <select value={location} onChange={(e) => setLocation(e.target.value)}>
                  <option value="all">Anywhere</option>{LOCATIONS.map((l) => <option key={l} value={l}>{l}</option>)}
                </select>
              </label>
              <label>Sort
                <select value={sort} onChange={(e) => setSort(e.target.value)}>
                  {Object.entries(SORTS).map(([k, [l]]) => <option key={k} value={k}>{l}</option>)}
                </select>
              </label>
            </section>

            <div className="notices">
              {firstTime && <div className="notice ok">Beginner-friendly ghosts are recommended for first-time users, so they show up first.</div>}
              {queue.length === 1 && <div className="notice warn">Only 1 ghost left in your area.</div>}
              <div className="notice">High-risk ghosts require approval. Some ghosts cannot be controlled once bonded.</div>
            </div>

            {current ? (
              <>
                <p className="muted center">{queue.length} ghost{queue.length > 1 ? "s" : ""} nearby · swipe right to befriend, left to ignore</p>
                <SwipeCard key={current.id} ghost={current} beginner={isBeginner(current)} onSwipe={onSwipe} onInfo={() => open(current)} />
                <div className="row center">
                  <button className="btn" onClick={() => toggle(setShortlist, current.id)}>{shortlist.includes(current.id) ? "★ Shortlisted" : "☆ Shortlist"}</button>
                  <button className="btn" onClick={() => toggle(setCompare, current.id, 3)}>{compare.includes(current.id) ? "✓ In compare" : "⇄ Compare"}</button>
                </div>
              </>
            ) : (
              <div className="empty">
                <div className="avatar small">🌙</div>
                <h2>No more ghosts here</h2>
                <p className="muted">Change your filters or start over.</p>
                <button className="btn primary" onClick={reset}>Reset everything</button>
              </div>
            )}
          </>
        )}

        {tab === "shortlist" && (
          shortlist.length ? (
            <ul className="list">
              {shortlist.map(byId).map((g) => (
                <GhostRow key={g.id} g={g} extra={
                  <span onClick={(e) => e.stopPropagation()} className="row">
                    <button className="btn small" onClick={() => toggle(setCompare, g.id, 3)}>{compare.includes(g.id) ? "✓" : "⇄"}</button>
                    <button className="btn small" onClick={() => toggle(setShortlist, g.id)}>Remove</button>
                  </span>
                } />
              ))}
            </ul>
          ) : <p className="muted center">Nothing shortlisted yet.</p>
        )}

        {tab === "friends" && (
          friends.length ? (
            <ul className="list">{friends.map(byId).map((g) => <GhostRow key={g.id} g={g} extra={g.uncontrollable ? <span className="tag fear-high">uncontrollable</span> : null} />)}</ul>
          ) : <p className="muted center">No ghost friends yet. Go swipe!</p>
        )}
      </main>

      {modal?.kind === "details" && (
        <Modal onClose={() => setModal(null)}>
          <Details
            g={modal.g}
            shortlisted={shortlist.includes(modal.g.id)}
            comparing={compare.includes(modal.g.id)}
            befriended={decisions[modal.g.id] === "befriend"}
            onShortlist={() => toggle(setShortlist, modal.g.id)}
            onCompare={() => toggle(setCompare, modal.g.id, 3)}
            onBefriend={() => tryBefriend(modal.g)}
          />
        </Modal>
      )}
      {modal?.kind === "compare" && (
        <Modal wide onClose={() => setModal(null)}>
          <Compare ghosts={compare.map(byId)} onRemove={(id) => toggle(setCompare, id)} />
        </Modal>
      )}
      {modal?.kind === "approval" && (
        <Modal onClose={() => setModal(null)}>
          <Approval g={modal.g} onCancel={() => setModal(null)} onApprove={() => { decide(modal.g.id, "befriend"); setModal(null); }} />
        </Modal>
      )}
    </div>
  );
}
