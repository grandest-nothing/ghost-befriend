import { useEffect, useMemo, useRef, useState } from "react";
import "./glass.css";
import { LOCATIONS } from "./data/ghosts.js";
import { usePokemon } from "./pokemon.js";
import { SORTS, REPLIES, greeting, isBeginner, isHighRisk, bondChance } from "./lib.js";
import Discover, { Details } from "./components/Discover.jsx";
import Nearby from "./components/Nearby.jsx";
import Compare from "./components/Compare.jsx";
import ApprovalSheet from "./components/ApprovalSheet.jsx";
import FledOverlay from "./components/FledOverlay.jsx";
import { Icon } from "./components/TabIcons.jsx";
import { Welcome, GhostGrid, Messages, Chat, MatchOverlay, FilterSheet } from "./components/Screens.jsx";

const load = (k, d) => { try { return JSON.parse(localStorage.getItem(k)) ?? d; } catch { return d; } };
function usePersist(key, init) {
  const [v, setV] = useState(() => load(key, init));
  useEffect(() => localStorage.setItem(key, JSON.stringify(v)), [key, v]);
  return [v, setV];
}

const TABS = [["home", "Home"], ["friends", "Matches"], ["saved", "Shortlist"], ["messages", "Messages"], ["compare", "Compare"]];

export default function App() {
  const ghosts = usePokemon();
  const [welcomed, setWelcomed] = usePersist("gb.welcomed", false);
  const [decisions, setDecisions] = usePersist("gb.decisions", {});
  const [shortlist, setShortlist] = usePersist("gb.shortlist", []);
  const [compare, setCompare] = usePersist("gb.compare", []);
  const [chats, setChats] = usePersist("gb.chats", {});
  const [unread, setUnread] = usePersist("gb.unread", {});
  const [tab, setTab] = useState("home");
  const [feed, setFeed] = useState("foryou");
  const [filters, setFilters] = useState({ fear: "all", minFriend: 0, location: "all", sort: "friendliness-desc" });
  const [filterOpen, setFilterOpen] = useState(false);
  const [history, setHistory] = useState([]);
  const [detailId, setDetailId] = useState(null);
  const [approval, setApproval] = useState(null);
  const [matchId, setMatchId] = useState(null);
  const [fledId, setFledId] = useState(null);
  const [chatId, setChatId] = useState(null);
  const chatRef = useRef(null);
  useEffect(() => { chatRef.current = chatId; }, [chatId]);

  const byId = (id) => ghosts.find((g) => g.id === id);
  const friends = Object.keys(decisions).filter((k) => decisions[k] === "befriend").map(Number).map(byId);
  const fledCount = Object.values(decisions).filter((v) => v === "fled").length;
  const firstTime = friends.length === 0;
  const filtersActive = filters.fear !== "all" || filters.minFriend > 0 || filters.location !== "all";
  const detail = detailId ? byId(detailId) : null;
  const match = matchId ? byId(matchId) : null;
  const fled = fledId ? byId(fledId) : null;

  // FOR YOU deck: filtered, sorted, beginner-first. NEARBY radar uses the same filtered pool, sorted by distance.
  const queue = useMemo(() => {
    let list = ghosts.filter((g) =>
      !decisions[g.id] && (filters.fear === "all" || g.fear === filters.fear) && g.friendliness >= filters.minFriend && (filters.location === "all" || g.location === filters.location)
    );
    if (feed === "nearby") return [...list].sort((a, b) => a.distance - b.distance);
    list = [...list].sort(SORTS[filters.sort][1]);
    if (firstTime) list = [...list.filter(isBeginner), ...list.filter((g) => !isBeginner(g))];
    return list;
  }, [ghosts, decisions, filters, feed, firstTime]);

  const notes = [];
  if (firstTime && feed === "foryou") notes.push({ cls: "ok", text: "Beginner-friendly ghosts first" });
  if (queue.length === 1) notes.push({ cls: "warn", text: "Only 1 ghost left in your area" });
  if (queue[0] && isHighRisk(queue[0])) notes.push({ cls: "bad", text: "High-risk ghosts require approval" });

  const mark = (id, d) => { setDecisions((p) => ({ ...p, [id]: d })); setHistory((h) => [...h, id]); };
  const ignore = (g) => { mark(g.id, "ignore"); setDetailId(null); };
  // Bond succeeded: opens the congrats pop-up.
  const befriend = (g) => {
    mark(g.id, "befriend");
    setChats((c) => ({ ...c, [g.id]: [{ from: "ghost", text: greeting(g), ts: Date.now() }] }));
    setUnread((u) => ({ ...u, [g.id]: 1 }));
    setDetailId(null); setApproval(null); setMatchId(g.id);
  };
  // Bond failed: the ghost runs away. Not added to the undo history, so Undo cannot re-roll it.
  const runAway = (g) => {
    setDecisions((p) => ({ ...p, [g.id]: "fled" }));
    setDetailId(null); setApproval(null); setFledId(g.id);
  };
  // Luck decides: every bond attempt rolls against the ghost's bond chance.
  const tryBond = (g) => (Math.random() < bondChance(g) ? befriend(g) : runAway(g));
  const requestBefriend = (g) => {
    if (decisions[g.id] === "befriend") return;
    if (isHighRisk(g)) setApproval(g); else tryBond(g);
  };
  const retryFled = () => setDecisions((p) => Object.fromEntries(Object.entries(p).filter(([, v]) => v !== "fled")));
  const release = (g) => setDecisions((p) => ({ ...p, [g.id]: "ignore" }));
  const undo = () => {
    const id = history[history.length - 1];
    if (!id) return;
    setHistory((h) => h.slice(0, -1));
    setDecisions((p) => { const n = { ...p }; delete n[id]; return n; });
  };
  const toggle = (setter, id, max) => setter((p) => (p.includes(id) ? p.filter((x) => x !== id) : max && p.length >= max ? [...p.slice(1), id] : [...p, id]));
  const resetAll = () => { setDecisions({}); setShortlist([]); setCompare([]); setChats({}); setUnread({}); setHistory([]); };

  const openChat = (id) => { setChatId(id); setTab("messages"); setUnread((u) => ({ ...u, [id]: 0 })); setMatchId(null); setDetailId(null); };
  const send = (id, text) => {
    setChats((c) => ({ ...c, [id]: [...(c[id] || []), { from: "me", text, ts: Date.now() }] }));
    const pool = REPLIES[byId(id).type];
    setTimeout(() => {
      setChats((c) => ({ ...c, [id]: [...(c[id] || []), { from: "ghost", text: pool[Math.floor(Math.random() * pool.length)], ts: Date.now() }] }));
      if (chatRef.current !== id) setUnread((u) => ({ ...u, [id]: (u[id] || 0) + 1 }));
    }, 900);
  };

  if (!welcomed) return <div className="phone"><Welcome ghosts={ghosts} onEnter={() => setWelcomed(true)} /></div>;

  const totalUnread = Object.values(unread).reduce((a, b) => a + b, 0);
  const openDetail = (g) => setDetailId(g.id);
  let screen;
  if (chatId) screen = <Chat g={byId(chatId)} msgs={chats[chatId] || []} onSend={(t) => send(chatId, t)} onBack={() => setChatId(null)} />;
  else if (tab === "home" && feed === "nearby")
    screen = <Nearby ghosts={queue} feed={feed} setFeed={setFeed} onOpen={openDetail} onBefriend={requestBefriend} onFilter={() => setFilterOpen(true)} filtersActive={filtersActive} />;
  else if (tab === "home")
    screen = (
      <Discover queue={queue} feed={feed} setFeed={setFeed} canUndo={history.length > 0} onUndo={undo} onFilter={() => setFilterOpen(true)} filtersActive={filtersActive}
        onSwipe={(dir, g) => (dir === "left" ? ignore(g) : requestBefriend(g))} onOpen={openDetail} shortlist={shortlist} onShortlist={(id) => toggle(setShortlist, id)} notes={notes} onReset={resetAll}
        fledCount={fledCount} onRetryFled={retryFled} />
    );
  else if (tab === "friends")
    screen = <GhostGrid title="Matches" ghosts={friends} onOpen={openDetail} onLeft={release} onRight={(g) => openChat(g.id)} leftIcon="💔" rightIcon="💬" empty="No ghost friends yet. Go swipe!" headerRight={<button className="btn small" onClick={resetAll}>Reset</button>} />;
  else if (tab === "saved")
    screen = <GhostGrid title="Shortlist" ghosts={shortlist.map(byId)} onOpen={openDetail} onLeft={(g) => toggle(setShortlist, g.id)} onRight={openDetail} leftIcon="✕" rightIcon="👁" empty="Nothing shortlisted yet. Tap the heart on a card." />;
  else if (tab === "messages") screen = <Messages friends={friends} chats={chats} unread={unread} onOpen={openChat} />;
  else screen = <Compare ghosts={ghosts} compare={compare} shortlist={shortlist} toggle={(id) => toggle(setCompare, id, 3)} onClear={() => setCompare([])} />;

  const tabIndex = Math.max(0, TABS.findIndex(([k]) => k === tab));

  return (
    <div className="phone">
      <div className="screen">{screen}</div>
      {!chatId && (
        <nav className="tabbar" aria-label="Main">
          <span className="glass-pill" style={{ transform: `translateX(${tabIndex * 100}%)` }} aria-hidden="true" />
          {TABS.map(([k, name]) => (
            <button key={k} className={tab === k ? "on" : ""} onClick={() => setTab(k)} aria-label={name} aria-current={tab === k ? "page" : undefined}>
              <Icon name={k} />
              {k === "messages" && totalUnread > 0 && <i className="badge top">{totalUnread}</i>}
            </button>
          ))}
        </nav>
      )}
      {detail && (
        <Details g={detail} shortlisted={shortlist.includes(detail.id)} comparing={compare.includes(detail.id)} befriended={decisions[detail.id] === "befriend"}
          onShortlist={() => toggle(setShortlist, detail.id)} onCompare={() => toggle(setCompare, detail.id, 3)} onIgnore={() => ignore(detail)} onBefriend={() => requestBefriend(detail)} onClose={() => setDetailId(null)} />
      )}
      {filterOpen && <FilterSheet filters={filters} setFilters={setFilters} locations={LOCATIONS} onClose={() => setFilterOpen(false)} />}
      {approval && <ApprovalSheet g={approval} onCancel={() => setApproval(null)} onApprove={() => tryBond(approval)} />}
      {match && <MatchOverlay g={match} onKeep={() => { setMatchId(null); setTab("home"); }} onMatches={() => { setMatchId(null); setTab("friends"); }} onChat={() => openChat(match.id)} />}
      {fled && <FledOverlay g={fled} onKeep={() => { setFledId(null); setTab("home"); }} />}
    </div>
  );
}
