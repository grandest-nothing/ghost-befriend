export const isHighRisk = (g) => g.fear === "high" || g.type === "vengeful";
export const isBeginner = (g) => g.fear === "low" && g.difficulty <= 2 && !g.uncontrollable;
export const stars = (p) => "★".repeat(Math.round(p / 20)) + "☆".repeat(5 - Math.round(p / 20));
export const dots = (n) => "●".repeat(n) + "○".repeat(5 - n);
export const GRAD = (g) => `linear-gradient(165deg, ${g.color}dd 0%, ${g.color}33 38%, #0b0710 80%)`;
export const label = (g) =>
  isBeginner(g) ? "★ BEGINNER FRIENDLY" : isHighRisk(g) ? "⚠ HIGH RISK · APPROVAL REQUIRED" : `✦ ${g.type.toUpperCase()}`;

// Chance (0.08 - 0.95) that a bond succeeds. Friendlier ghosts help; difficulty, fear and
// "cannot be controlled" hurt. Examples: Gastly ~91%, Mismagius ~60%, Froslass ~25%, Myotismon ~22%.
const FEAR_PENALTY = { low: 0, medium: 0.05, high: 0.12 };
export const bondChance = (g) => {
  const c = 0.3 + (g.friendliness / 100) * 0.45 + (5 - g.difficulty) * 0.05 - FEAR_PENALTY[g.fear] - (g.uncontrollable ? 0.03 : 0);
  return Math.min(0.95, Math.max(0.08, c));
};
export const chancePct = (g) => Math.round(bondChance(g) * 100);
export const chanceTier = (g) => (chancePct(g) >= 70 ? "good" : chancePct(g) >= 40 ? "mid" : "low");

export const SORTS = {
  "friendliness-desc": ["Friendliest first", (a, b) => b.friendliness - a.friendliness],
  "difficulty-asc": ["Easiest bond first", (a, b) => a.difficulty - b.difficulty],
  "difficulty-desc": ["Hardest bond first", (a, b) => b.difficulty - a.difficulty],
};

export const greeting = (g) =>
  ({
    friendly: `Hi! I'm ${g.name}. Thanks for choosing me 👻`,
    mischievous: `Hehe, ${g.name} here. Did you check your pockets yet?`,
    vengeful: `You dared to bond with me. Do not disappoint me.`,
    neutral: `${g.name} acknowledges your presence.`,
  })[g.type];

export const REPLIES = {
  friendly: ["That makes me so happy 💜", "Want to hear a lullaby?", "*a cozy cold breeze surrounds you*"],
  mischievous: ["Hehe, your keys are in the fridge now.", "Boo! Did I scare you?", "*a spoon rattles somewhere*"],
  vengeful: ["...", "Remember who you are speaking to.", "*the lights flicker*"],
  neutral: ["Noted.", "Interesting. Continue.", "*a quiet nod from the shadows*"],
};

export const ago = (ts) => {
  const m = Math.max(1, Math.round((Date.now() - ts) / 60000));
  return m < 60 ? `${m} min` : `${Math.round(m / 60)} h`;
};
