# 👻 Ghost Befriend

A Tinder-style swipe app for choosing which ghost to befriend. Built for study purposes with **Vite + React** (no extra runtime dependencies). The UI follows a dark dating-app Figma concept: full-bleed swipe cards, a Matches grid, a "bonded" pop-up, Messages and a welcome screen.

## Features
- **FOR YOU**: swipe cards (drag, tap for details, or use the pill buttons): right = befriend, left = ignore, back arrow = undo. Beginner-friendly ghosts come first for new users.
- **NEARBY**: a ghost radar. You are the center dot and every ghost sits at its real distance. Pick a 5 / 10 / 30 km range, tap a blip for a preview card (Details / Befriend), and browse the "Closest to you" list. High-risk ghosts have a red ring.
- **47 creatures**: 37 Pokémon plus 10 Digimon, from haunted attics and old churches to pumpkin patches, lighthouses and mansions.
- Congrats pop-up whenever you befriend a ghost: shows the ghost's card with its details, plus Chat now / Keep swiping / View matches
- Ghost data: name, type, haunting style, fear level, friendliness, location, bond difficulty, short description, elemental types
- Filters: fear level, friendliness, location (apply to both feeds). Sort: friendliness or bond difficulty
- Actions: view details, shortlist (heart), compare (up to 3), befriend
- System messages: "Only 1 ghost left in your area", high-risk approval flow, beginner-friendly recommendation for first-time users, warning for ghosts that cannot be controlled once bonded
- Chat with your ghost friends (canned replies), saved in `localStorage`

## Creature data
- Pokémon names, types and official artwork come from [PokéAPI](https://pokeapi.co/) (`/api/v2/pokemon/{id}`).
- Digimon names and artwork come from [Digi-API](https://digi-api.com/) (`/api/v1/digimon/{name}`).
- Responses are cached in `localStorage` so each creature is fetched only once. If an image fails to load, the creature's emoji is shown instead.
- Pokémon is © Nintendo, Game Freak and The Pokémon Company; Digimon is © Bandai / Toei Animation. This project is a non-commercial study exercise.

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
Add or swap creatures in `src/data/ghosts.js` with the `mk(...)` helper (`source` is `"pokemon"` with a Pokédex number, or `"digimon"` with the Digimon's name). Styles live in `src/styles.css` (app) and `src/nearby.css` (radar).
