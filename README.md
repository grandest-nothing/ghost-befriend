# 👻 Ghost Befriend

A Tinder-style swipe app for choosing which ghost to befriend. Built for study purposes with **Vite + React** (no extra runtime dependencies). The UI follows a dark dating-app Figma concept: full-bleed swipe cards, a Matches grid, a "bonded" pop-up, Messages and a welcome screen.

## Features
- Swipe cards (drag, tap for details, or use the pill buttons): right = befriend, left = ignore, back arrow = undo
- Congrats pop-up whenever you befriend a ghost: shows the ghost's card with its details, plus Chat now / Keep swiping / View matches
- FOR YOU (sorted, beginner-first) and NEARBY (sorted by distance) feeds
- Ghost data: name, type, haunting style, fear level, friendliness, location, bond difficulty, short description, Pokémon types
- Filters: fear level, friendliness, location. Sort: friendliness or bond difficulty
- Actions: view details, shortlist (heart), compare (up to 3), befriend
- System messages: "Only 1 ghost left in your area", high-risk approval flow, beginner-friendly recommendation for first-time users, warning for ghosts that cannot be controlled once bonded
- Chat with your ghost friends (canned replies), saved in `localStorage`

## Pokémon data
Ghost names, types and official artwork are fetched from [PokéAPI](https://pokeapi.co/) (`/api/v2/pokemon/{id}`) and cached in `localStorage`, following the API's fair-use policy. Emojis are used only if an image fails to load. Pokémon and their artwork belong to Nintendo, Game Freak and The Pokémon Company; this project is a non-commercial study exercise.

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
Edit `src/data/ghosts.js` to swap Pokémon (change `pokeId`) or tweak stats. Styles live in `src/styles.css`.
