import { useEffect, useState } from "react";

// Digimon art from Digi-API always has a solid white background. We erase the white that is connected to the
// image border (flood fill), so white *inside* the creature (e.g. Bakemon's sheet) is kept, then soften the edge.
const cache = new Map();

function cutout(img) {
  const w = img.naturalWidth;
  const h = img.naturalHeight;
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  ctx.drawImage(img, 0, 0);
  const data = ctx.getImageData(0, 0, w, h);
  const p = data.data;

  const isWhite = (k) => p[k * 4] > 228 && p[k * 4 + 1] > 228 && p[k * 4 + 2] > 228;
  const gone = new Uint8Array(w * h);
  const stack = [];
  const push = (x, y) => {
    const k = y * w + x;
    if (!gone[k] && isWhite(k)) { gone[k] = 1; stack.push(k); }
  };
  for (let x = 0; x < w; x++) { push(x, 0); push(x, h - 1); }
  for (let y = 0; y < h; y++) { push(0, y); push(w - 1, y); }
  while (stack.length) {
    const k = stack.pop();
    const x = k % w;
    const y = (k / w) | 0;
    if (x > 0) push(x - 1, y);
    if (x < w - 1) push(x + 1, y);
    if (y > 0) push(x, y - 1);
    if (y < h - 1) push(x, y + 1);
  }

  // Soften the halo: light pixels touching the removed area become partly transparent.
  const alpha = new Uint8Array(w * h).fill(255);
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const k = y * w + x;
      if (gone[k]) { alpha[k] = 0; continue; }
      const nearGone = (x > 0 && gone[k - 1]) || (x < w - 1 && gone[k + 1]) || (y > 0 && gone[k - w]) || (y < h - 1 && gone[k + w]);
      if (nearGone) {
        const m = Math.min(p[k * 4], p[k * 4 + 1], p[k * 4 + 2]);
        if (m > 190) alpha[k] = Math.max(0, Math.min(255, (255 - m) * 4));
      }
    }
  }
  for (let k = 0; k < w * h; k++) p[k * 4 + 3] = alpha[k];
  ctx.putImageData(data, 0, 0);
  return canvas.toDataURL("image/png");
}

function useCutout(src, onFail) {
  const [out, setOut] = useState(() => (src ? cache.get(src) ?? null : null));
  useEffect(() => {
    if (!src) return undefined;
    if (cache.has(src)) { setOut(cache.get(src)); return undefined; }
    setOut(null);
    let off = false;
    const img = new Image();
    img.onload = () => {
      try {
        const url = cutout(img);
        cache.set(src, url);
        if (!off) setOut(url);
      } catch { if (!off) onFail(); }
    };
    img.onerror = () => { if (!off) onFail(); };
    img.src = src;
    return () => { off = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [src]);
  return out;
}

// Creature artwork (PokeAPI / Digi-API); falls back to the emoji if that exact image fails to load.
export default function Pic({ g, className = "" }) {
  const [badSrc, setBadSrc] = useState(null);
  const isDigimon = g.source === "digimon";
  const cut = useCutout(isDigimon ? g.image : null, () => setBadSrc(g.image));

  if (!g.image || badSrc === g.image) return <span className={`pic emoji ${className}`}>{g.emoji}</span>;
  if (isDigimon && !cut) return <span className={`pic loading ${className}`} role="img" aria-label={g.name} />;
  return (
    <img
      className={`pic ${className}`}
      src={isDigimon ? cut : g.image}
      alt={g.name}
      draggable={false}
      onError={() => setBadSrc(g.image)}
    />
  );
}
