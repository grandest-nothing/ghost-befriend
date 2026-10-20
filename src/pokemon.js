import { useEffect, useMemo, useState } from "react";
import { GHOSTS } from "./data/ghosts.js";

// Pokemon: PokeAPI (types + official artwork). Names stay as written in src/data/ghosts.js, because the API
// returns form names such as "aegislash-shield" or "mimikyu-disguised".
// Digimon: artwork from Digi-API, served same-origin via /digi-img (see vercel.json / vite.config.js)
// so Pic.jsx can remove the white background.
const POKE_API = "https://pokeapi.co/api/v2/pokemon/";
const POKE_ART = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/";
const KEY = "gb.creatures.v3";

const cap = (s) => s.split("-").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
const load = () => { try { return JSON.parse(localStorage.getItem(KEY)) ?? {}; } catch { return {}; } };
const cacheKey = (g) => `${g.source}:${g.key}`;
const digimonImage = (g) => `/digi-img/${encodeURIComponent(g.key)}.png`;

async function fetchPokemon(g) {
  const r = await fetch(POKE_API + g.key);
  if (!r.ok) return null;
  const d = await r.json();
  const entry = { elements: d.types.map((t) => cap(t.type.name)) };
  const img = d.sprites?.other?.["official-artwork"]?.front_default || d.sprites?.front_default;
  if (img) entry.image = img;
  return entry;
}

// Fetches each Pokemon once and caches it in localStorage (keeps API traffic low, per PokeAPI's fair-use policy).
export function usePokemon() {
  const [cache, setCache] = useState(load);

  useEffect(() => {
    let off = false;
    GHOSTS.filter((g) => g.source === "pokemon" && !cache[cacheKey(g)]).forEach(async (g) => {
      try {
        const entry = await fetchPokemon(g);
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

  return useMemo(
    () =>
      GHOSTS.map((g) => {
        if (g.source === "digimon") return { ...g, image: digimonImage(g) };
        const { elements, image } = cache[cacheKey(g)] || {};
        return { ...g, image: image || `${POKE_ART}${g.key}.png`, elements: elements || g.elements };
      }),
    [cache]
  );
}
