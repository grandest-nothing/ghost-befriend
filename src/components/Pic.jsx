import { useState } from "react";

// Creature artwork (PokeAPI / Digi-API); falls back to the emoji if that exact image fails to load.
export default function Pic({ g, className = "" }) {
  const [badSrc, setBadSrc] = useState(null);
  if (!g.image || badSrc === g.image) return <span className={`pic emoji ${className}`}>{g.emoji}</span>;
  return <img className={`pic ${className}`} src={g.image} alt={g.name} draggable={false} onError={() => setBadSrc(g.image)} />;
}
