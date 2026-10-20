# 👻 Ghost Befriend

A Tinder-style swipe app for choosing which ghost to befriend. Built for study purposes with **Vite + React** (no extra runtime dependencies).

## Features
- Swipe cards (drag, or use the ✕ / ♥ buttons): right = befriend, left = ignore
- Ghost data: name, type, haunting style, fear level, friendliness (stars + %), location, bond difficulty, short description, Pokémon-style elements (Ghost, Dark, Poison...)
- Filters: fear level, friendliness, location. Sort: friendliness or bond difficulty
- Actions: view details, shortlist, compare (up to 3), befriend
- System messages: "Only 1 ghost left in your area", high-risk approval flow, beginner-friendly recommendation for first-time users, warning for ghosts that cannot be controlled once bonded
- Progress is saved in `localStorage`

## Run locally
```bash
npm install
npm run dev
```

## Deploy on Vercel
1. Go to [vercel.com/new](https://vercel.com/new) and import this GitHub repo.
2. Vercel detects Vite automatically (build: `npm run build`, output: `dist`).
3. Click **Deploy**.

## Customize
Edit `src/data/ghosts.js` to add ghosts. Colors and layout live in `src/styles.css`.
