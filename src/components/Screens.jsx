import { useEffect, useRef, useState } from "react";
import { GRAD, SORTS, ago, dots, isHighRisk, stars } from "../lib.js";
import Pic from "./Pic.jsx";

export function Welcome({ ghosts, onEnter }) {
  const [a, b] = [ghosts[0], ghosts[4]];
  return (
    <div className="welcome">
      <div className="wcards">
        <div className="wc l" style={{ background: GRAD(b) }}><Pic g={b} /><small>{b.name}, {b.location}</small></div>
        <div className="wc r" style={{ background: GRAD(a) }}><Pic g={a} /><small>{a.name}, {a.location}</small></div>
      </div>
      <h1>Find Your<br /><span>Best Ghost</span></h1>
      <p className="muted">Swipe through haunted places nearby and befriend the spirit that fits you.</p>
      <ul className="rules">
        <li>Only a few ghosts are left in your area</li>
        <li>High-risk ghosts require approval</li>
        <li>Beginner-friendly ghosts are recommended first</li>
        <li>Some ghosts cannot be controlled once bonded</li>
      </ul>
      <button className="cta cyan" onClick={onEnter}>JOIN THE HAUNT</button>
      <button className="linkbtn" onClick={onEnter}>CONTINUE AS GUEST</button>
    </div>
  );
}

export function GhostGrid({ title, ghosts, onOpen, onLeft, onRight, leftIcon, rightIcon, empty, headerRight }) {
  return (
    <div className="page">
      <header className="ph"><h1>{title}</h1><div className="hr">{headerRight}</div></header>
      {ghosts.length ? (
        <div className="grid">
          {ghosts.map((g) => (
            <div key={g.id} className="gcard" style={{ background: GRAD(g) }} onClick={() => onOpen(g)}>
              <div className="gemoji"><Pic g={g} /></div>
              <div className="gname">{g.name} <small>{g.years}</small></div>
              <div className="gbtns" onClick={(e) => e.stopPropagation()}>
                <button className="gl" onClick={() => onLeft(g)}>{leftIcon}</button>
                <button className="gr" onClick={() => onRight(g)}>{rightIcon}</button>
              </div>
            </div>
          ))}
        </div>
      ) : <p className="muted pad">{empty}</p>}
    </div>
  );
}

export function Messages({ friends, chats, unread, onOpen }) {
  const [q, setQ] = useState("");
  const list = friends.filter((g) => g.name.toLowerCase().includes(q.toLowerCase()));
  return (
    <div className="page">
      <header className="ph"><h1>Messages</h1></header>
      <input className="search" placeholder="🔍 Search" value={q} onChange={(e) => setQ(e.target.value)} />
      <div className="stories">
        <div className="story"><span className="ring">🧑</span><small>You</small></div>
        {friends.map((g) => <div key={g.id} className="story" onClick={() => onOpen(g.id)}><span className="ring" style={{ background: GRAD(g) }}><Pic g={g} /></span><small>{g.name.split(" ")[0]}</small></div>)}
      </div>
      <h3 className="sub">Messages</h3>
      {list.length ? list.map((g) => {
        const last = (chats[g.id] || []).slice(-1)[0];
        return (
          <div key={g.id} className="mrow" onClick={() => onOpen(g.id)}>
            <span className="ring sm" style={{ background: GRAD(g) }}><Pic g={g} /></span>
            <div className="grow"><b>{g.name}</b><p>{last ? (last.from === "me" ? "You: " : "") + last.text : "Say hi!"}</p></div>
            <div className="meta">{last && <small>{ago(last.ts)}</small>}{unread[g.id] > 0 && <i className="badge">{unread[g.id]}</i>}</div>
          </div>
        );
      }) : <p className="muted pad">Befriend a ghost to start chatting.</p>}
    </div>
  );
}

export function Chat({ g, msgs, onSend, onBack }) {
  const [t, setT] = useState("");
  const end = useRef(null);
  useEffect(() => { end.current?.scrollIntoView({ behavior: "smooth" }); }, [msgs.length]);
  const submit = (e) => { e.preventDefault(); if (!t.trim()) return; onSend(t.trim()); setT(""); };
  return (
    <div className="chat">
      <header className="ch"><button className="circle" onClick={onBack}>‹</button><span className="ring sm" style={{ background: GRAD(g) }}><Pic g={g} /></span><b>{g.name}</b></header>
      <div className="msgs">
        {msgs.map((m, i) => <div key={i} className={`bubble ${m.from}`}>{m.text}</div>)}
        <div ref={end} />
      </div>
      <form className="composer" onSubmit={submit}>
        <input value={t} onChange={(e) => setT(e.target.value)} placeholder="Write to your ghost..." />
        <button className="cta small">SEND</button>
      </form>
    </div>
  );
}

export function ComparePage({ ghosts, compare, toggle }) {
  const picked = compare.map((id) => ghosts.find((g) => g.id === id));
  const rows = [
    ["Type", (g) => g.type], ["Elements", (g) => g.elements.join(" / ")], ["Haunting", (g) => g.haunting],
    ["Fear level", (g) => g.fear], ["Friendliness", (g) => `${stars(g.friendliness)} ${g.friendliness}%`],
    ["Location", (g) => g.location], ["Distance", (g) => `${g.distance} km`], ["Bond difficulty", (g) => dots(g.difficulty)],
    ["Controllable", (g) => (g.uncontrollable ? "No" : "Yes")], ["Approval needed", (g) => (isHighRisk(g) ? "Yes" : "No")],
  ];
  return (
    <div className="page">
      <header className="ph"><h1>Compare</h1></header>
      <p className="muted pad0">Pick up to 3 ghosts.</p>
      <div className="chips wrap">
        {ghosts.map((g) => <button key={g.id} className={`chip pick ${compare.includes(g.id) ? "on" : ""}`} onClick={() => toggle(g.id)}><Pic g={g} className="xs" /> {g.name}</button>)}
      </div>
      {picked.length >= 2 ? (
        <div className="scroll">
          <table>
            <thead><tr><th />{picked.map((g) => <th key={g.id}><Pic g={g} className="sm" /><br />{g.name}</th>)}</tr></thead>
            <tbody>{rows.map(([l, f]) => <tr key={l}><th>{l}</th>{picked.map((g) => <td key={g.id}>{f(g)}</td>)}</tr>)}</tbody>
          </table>
        </div>
      ) : <p className="muted pad">Select at least 2 ghosts to compare.</p>}
    </div>
  );
}

export function MatchOverlay({ g, onKeep, onChat, onMatches }) {
  const facts = [
    ["Type", g.type], ["Haunting", g.haunting], ["Fear level", g.fear],
    ["Friendliness", `${g.friendliness}%`], ["Bond difficulty", dots(g.difficulty)], ["Location", g.location],
  ];
  const confetti = ["✨", "💜", "👻", "✨", "🎉", "💜", "✨", "👻"];
  return (
    <div className="match" role="dialog" aria-modal="true" aria-label={`You just befriended ${g.name}`}>
      <div className="confetti" aria-hidden="true">
        {confetti.map((c, i) => <span key={i} style={{ left: `${6 + i * 12}%`, animationDelay: `${i * 0.18}s` }}>{c}</span>)}
      </div>
      <p className="kicker">🎉 CONGRATS!</p>
      <h1 className="serif">bonded</h1>
      <p className="lead">You just befriended <b>{g.name}</b></p>
      <div className="bcard" style={{ background: GRAD(g) }}>
        <Pic g={g} />
        <h2>{g.name} <small>{g.years}</small></h2>
        <div className="chips center">{g.elements.map((e) => <span key={e} className="chip">✨ {e}</span>)}</div>
        <p className="bdesc">{g.description}</p>
        <dl className="facts">{facts.map(([k, v]) => <div key={k}><dt>{k}</dt><dd>{v}</dd></div>)}</dl>
        {g.uncontrollable && <p className="flag">⚠ {g.name} cannot be controlled once bonded.</p>}
      </div>
      <p className="muted">You have 24 hours to take a first step with your new ghost friend.</p>
      <div className="mfoot">
        <button className="cta" onClick={onChat}>CHAT NOW</button>
        <div className="mlinks">
          <button className="linkbtn" onClick={onKeep}>KEEP SWIPING</button>
          <button className="linkbtn" onClick={onMatches}>VIEW MATCHES</button>
        </div>
      </div>
    </div>
  );
}

export function Approval({ g, onCancel, onApprove }) {
  const [ok, setOk] = useState(false);
  const [text, setText] = useState("");
  const ready = ok && text.trim().toUpperCase() === "APPROVE";
  return (
    <div className="overlay" onClick={onCancel}>
      <div className="sheet" onClick={(e) => e.stopPropagation()}>
        <h2>⚠ Approval required</h2>
        <p><b>{g.name}</b> is a high-risk ghost (fear: {g.fear}, type: {g.type}). {g.uncontrollable ? "It cannot be controlled once bonded. " : ""}A guardian or admin must approve this bond.</p>
        <label className="check"><input type="checkbox" checked={ok} onChange={(e) => setOk(e.target.checked)} /> I understand the risks.</label>
        <input className="search" placeholder='Type "APPROVE" to confirm' value={text} onChange={(e) => setText(e.target.value)} />
        <div className="row">
          <button className="btn" onClick={onCancel}>Cancel</button>
          <button className="cta small" disabled={!ready} onClick={onApprove}>Approve and befriend</button>
        </div>
      </div>
    </div>
  );
}

export function FilterSheet({ filters, setFilters, locations, onClose }) {
  const set = (k, v) => setFilters((f) => ({ ...f, [k]: v }));
  return (
    <div className="overlay" onClick={onClose}>
      <div className="sheet" onClick={(e) => e.stopPropagation()}>
        <h2>Filters</h2>
        <label>Fear level
          <select value={filters.fear} onChange={(e) => set("fear", e.target.value)}>
            <option value="all">Any</option><option value="low">Low</option><option value="medium">Medium</option><option value="high">High</option>
          </select>
        </label>
        <label>Friendliness
          <select value={filters.minFriend} onChange={(e) => set("minFriend", Number(e.target.value))}>
            <option value={0}>Any</option><option value={50}>50%+</option><option value={70}>70%+</option><option value={85}>85%+</option>
          </select>
        </label>
        <label>Location
          <select value={filters.location} onChange={(e) => set("location", e.target.value)}>
            <option value="all">Anywhere</option>{locations.map((l) => <option key={l} value={l}>{l}</option>)}
          </select>
        </label>
        <label>Sort (For you)
          <select value={filters.sort} onChange={(e) => set("sort", e.target.value)}>
            {Object.entries(SORTS).map(([k, [l]]) => <option key={k} value={k}>{l}</option>)}
          </select>
        </label>
        <div className="row">
          <button className="btn" onClick={() => setFilters({ fear: "all", minFriend: 0, location: "all", sort: "friendliness-desc" })}>Clear</button>
          <button className="cta small" onClick={onClose}>Done</button>
        </div>
      </div>
    </div>
  );
}
