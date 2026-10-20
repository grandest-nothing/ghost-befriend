import { useEffect, useMemo, useState } from "react";
import { GHOSTS } from "./data/ghosts.js";

// Pokemon: PokeAPI (name, types, official artwork). Digimon: Digi-API (name, artwork).
const POKE_API = "https://pokeapi.co/api/v2/pokemon/";
const POKE_ART = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/";
const DIGI_API = "https://digi-api.com/api/v1/digimon/";
const DIGI_ART = "https://digi-api.com/images/digimon/w/";
const KEY = "gb.creatures.v2";

const cap = (s) => s.split("-").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
const load = () => { try { return JSON.parse(localStorage.getItem(KEY)) ?? {}; } catch { return {}; } };
const cacheKey = (g) => `${g.source}:${g.key}`;
const fallbackImage = (g) => (g.source === "digimon" ? `${DIGI_ART}${encodeURIComponent(g.key)}.png` : `${POKE_ART}${g.key}.png`);

async function fetchEntry(g) {
  if (g.source === "digimon") {
    const r = await fetch(DIGI_API + encodeURIComponent(g.key.toLowerCase()));
    if (!r.ok) return null;
    const d = await r.json();
    const entry = {};
    if (d.name) entry.name = d.name;
    const img = d.images?.[0]?.href;
    if (img) entry.image = img;
    return entry;
  }
  const r = await fetch(POKE_API + g.key);
  if (!r.ok) return null;
  const d = await r.json();
  const entry = { name: cap(d.name), elements: d.types.map((t) => cap(t.type.name)) };
  const img = d.sprites?.other?.["official-artwork"]?.front_default || d.sprites?.front_default;
  if (img) entry.image = img;
  return entry;
}

// Fetches each creature once and caches it in localStorage (keeps API traffic low, per the APIs' fair-use guidance).
export function usePokemon() {
  const [cache, setCache] = useState(load);

  useEffect(() => {
    let off = false;
    GHOSTS.filter((g) => !cache[cacheKey(g)]).forEach(async (g) => {
      try {
        const entry = await fetchEntry(g);
        if (!entry || off) return;
        setCache((c) => {
          const next = { ...c, [cacheKey(g)]: entry };
          try { localStorage.setItem(KEY, JSON.stringify(next)); } catch { /* storage full */ }
          return next;
        });
      } catch { /* offline: fallbacks are used */ }
    });
    return () => { off = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return useMemo(() => GHOSTS.map((g) => ({ ...g, image: fallbackImage(g), ...cache[cacheKey(g)] })), [cache]);
}
