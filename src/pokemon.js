import { useEffect, useMemo, useState } from "react";
import { GHOSTS } from "./data/ghosts.js";

const API = "https://pokeapi.co/api/v2/pokemon/";
const ART = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/";
const KEY = "gb.poke.v1";

const cap = (s) => s.split("-").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
const load = () => { try { return JSON.parse(localStorage.getItem(KEY)) ?? {}; } catch { return {}; } };

// Fetches each Pokemon once from PokeAPI and caches it in localStorage (PokeAPI fair-use policy).
export function usePokemon() {
  const [cache, setCache] = useState(load);

  useEffect(() => {
    let off = false;
    GHOSTS.filter((g) => !cache[g.pokeId]).forEach(async (g) => {
      try {
        const r = await fetch(API + g.pokeId);
        if (!r.ok) return;
        const d = await r.json();
        const entry = {
          name: cap(d.name),
          elements: d.types.map((t) => cap(t.type.name)),
          image: d.sprites?.other?.["official-artwork"]?.front_default || d.sprites?.front_default,
        };
        if (off) return;
        setCache((c) => {
          const next = { ...c, [g.pokeId]: entry };
          try { localStorage.setItem(KEY, JSON.stringify(next)); } catch { /* storage full */ }
          return next;
        });
      } catch { /* offline: fallbacks are used */ }
    });
    return () => { off = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return useMemo(() => GHOSTS.map((g) => ({ ...g, image: `${ART}${g.pokeId}.png`, ...cache[g.pokeId] })), [cache]);
}
