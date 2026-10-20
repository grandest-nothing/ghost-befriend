import { useState } from "react";

// Pokemon artwork from PokeAPI; falls back to the ghost's emoji if the image fails to load.
export default function Pic({ g, className = "" }) {
  const [bad, setBad] = useState(false);
  if (bad || !g.image) return <span className={`pic emoji ${className}`}>{g.emoji}</span>;
  return <img className={`pic ${className}`} src={g.image} alt={g.name} draggable={false} onError={() => setBad(true)} />;
}
