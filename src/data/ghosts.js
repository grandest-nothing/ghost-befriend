// Roster of ghost-like creatures. Pokemon come from PokeAPI, Digimon from Digi-API.
// Name, types and artwork are refreshed at runtime (see src/pokemon.js); values here are fallbacks.
//
// mk(id, source, key, name, emoji, color, elements, type, haunting, fear,
//    friendliness, location, difficulty, uncontrollable, years, distance, description)
//   source: "pokemon" (key = Pokedex number) | "digimon" (key = Digimon name)
//   type: friendly | mischievous | vengeful | neutral
//   haunting: whispers | moving objects | full apparition
//   fear: low | medium | high   friendliness: 0-100   difficulty: 1-5
//   years: how long it has been haunting   distance: km from the user
const mk = (id, source, key, name, emoji, color, elements, type, haunting, fear, friendliness, location, difficulty, uncontrollable, years, distance, description) => ({
  id, source, key, name, emoji, color, elements, type, haunting, fear, friendliness, location, difficulty, uncontrollable, years, distance, description,
});

export const GHOSTS = [
  mk(1, "pokemon", 92, "Gastly", "👻", "#8b7cf6", ["Ghost", "Poison"], "friendly", "whispers", "low", 92, "attic", 1, false, 214, 2.5, "A shy gas spirit that drifts between dusty boxes and hums to itself. Loves being noticed."),
  mk(2, "pokemon", 88, "Grimer", "🫧", "#a855f7", ["Poison"], "mischievous", "moving objects", "low", 74, "basement", 2, false, 87, 4.1, "Leaves slimy footprints and hides your left socks. Harmless, mostly."),
  mk(3, "pokemon", 429, "Mismagius", "🎩", "#a78bfa", ["Ghost"], "neutral", "full apparition", "medium", 55, "library", 3, false, 163, 7.8, "A bookish spirit that only appears to critique your reading list."),
  mk(4, "pokemon", 478, "Froslass", "😱", "#7dd3fc", ["Ice", "Ghost"], "vengeful", "whispers", "high", 22, "forest", 5, true, 402, 12.3, "Her whispers freeze travelers in place. Bonding is possible, but she will not take orders."),
  mk(5, "pokemon", 228, "Houndour", "🐺", "#64748b", ["Dark", "Fire"], "friendly", "full apparition", "medium", 85, "forest", 2, false, 59, 9.6, "A spectral hound that guards campers at night. Fetches sticks that no longer exist."),
  mk(6, "pokemon", 479, "Rotom", "🪑", "#fb923c", ["Electric", "Ghost"], "mischievous", "moving objects", "medium", 48, "kitchen", 3, true, 36, 3.2, "Possesses appliances at 3 AM and rearranges the kitchen when ignored."),
  mk(7, "pokemon", 681, "Aegislash", "🛡️", "#94a3b8", ["Steel", "Ghost"], "vengeful", "full apparition", "high", 18, "castle", 5, true, 640, 25, "A royal blade bound to an oath it can no longer remember. Dangerous when provoked."),
  mk(8, "pokemon", 425, "Drifloon", "🌫️", "#38bdf8", ["Ghost", "Flying"], "friendly", "whispers", "low", 88, "graveyard", 1, false, 178, 1.4, "A balloon-like spirit that floats over the graveyard and keeps lonely visitors company."),
  mk(9, "pokemon", 94, "Gengar", "🕷️", "#6d28d9", ["Ghost", "Poison"], "vengeful", "full apparition", "high", 30, "basement", 4, false, 95, 5.7, "Lurks in your shadow and copies every move. Respects those who show generosity."),
  mk(10, "pokemon", 607, "Litwick", "🏮", "#facc15", ["Ghost", "Fire"], "neutral", "moving objects", "low", 66, "swamp", 2, false, 120, 14.2, "Floats ahead of travelers carrying a little flame. Leads you home or gets you lost."),
  mk(11, "pokemon", 563, "Cofagrigus", "🦇", "#c084fc", ["Ghost"], "neutral", "whispers", "medium", 52, "graveyard", 4, true, 311, 6.3, "Knows every secret buried here and trades them for good company."),
  mk(12, "pokemon", 778, "Mimikyu", "🐸", "#2dd4bf", ["Ghost", "Fairy"], "mischievous", "full apparition", "medium", 61, "swamp", 3, false, 73, 11, "Hides under a tattered cloth in the reeds and tells riddles. Answer right and it might stop following you."),

  mk(13, "pokemon", 355, "Duskull", "💀", "#64748b", ["Ghost"], "neutral", "whispers", "medium", 50, "old church", 3, false, 140, 3.8, "A hooded skull that follows quietly behind lost souls, never quite showing its face."),
  mk(14, "pokemon", 356, "Dusclops", "👁️", "#6b7280", ["Ghost"], "neutral", "full apparition", "medium", 44, "old church", 4, true, 260, 4.6, "A one-eyed collector of whispers that listens to everything said in the chapel."),
  mk(15, "pokemon", 353, "Shuppet", "🧸", "#7c3aed", ["Ghost"], "mischievous", "whispers", "low", 70, "nursery", 2, false, 40, 2.1, "Drifts toward grudges, but a kind word makes it hover happily at your shoulder."),
  mk(16, "pokemon", 354, "Banette", "🪆", "#a21caf", ["Ghost"], "vengeful", "moving objects", "high", 28, "nursery", 4, true, 85, 5.2, "A forgotten doll holding a grudge. Handle with care and plenty of apologies."),
  mk(17, "pokemon", 200, "Misdreavus", "🔮", "#8b5cf6", ["Ghost"], "mischievous", "whispers", "low", 78, "bridge", 2, false, 190, 6.7, "Giggles through the night and weaves scary sounds just to see you jump."),
  mk(18, "pokemon", 302, "Sableye", "💎", "#38bdf8", ["Dark", "Ghost"], "mischievous", "full apparition", "medium", 58, "cave", 3, false, 310, 8.9, "Lurks in dark caves hunting gems. Will trade shiny things for company."),
  mk(19, "pokemon", 442, "Spiritomb", "🌀", "#475569", ["Ghost", "Dark"], "neutral", "whispers", "high", 35, "bridge", 5, true, 108, 15.4, "108 spirits bound in one keystone. Moody, ancient, and hard to impress."),
  mk(20, "pokemon", 562, "Yamask", "🎭", "#f59e0b", ["Ghost"], "neutral", "full apparition", "low", 62, "ruins", 2, false, 280, 7.1, "Carries a mask of its former face and quietly stares at it all day."),
  mk(21, "pokemon", 708, "Phantump", "🌲", "#16a34a", ["Ghost", "Grass"], "friendly", "whispers", "low", 80, "forest", 2, false, 52, 3, "A lost child's spirit in a tree stump. Leads travelers out of the woods."),
  mk(22, "pokemon", 709, "Trevenant", "🌳", "#166534", ["Ghost", "Grass"], "vengeful", "full apparition", "high", 26, "forest", 4, true, 330, 18.8, "The old forest's guardian. Lets nobody cut a branch and forgets nothing."),
  mk(23, "pokemon", 710, "Pumpkaboo", "🎃", "#f97316", ["Ghost", "Grass"], "mischievous", "moving objects", "low", 76, "pumpkin patch", 1, false, 18, 1.9, "A tiny pumpkin lantern that hops after trick-or-treaters."),
  mk(24, "pokemon", 711, "Gourgeist", "🎃", "#ea580c", ["Ghost", "Grass"], "mischievous", "whispers", "medium", 46, "pumpkin patch", 3, true, 90, 4.4, "Sings an eerie tune in the night and drags anyone who joins in into its patch."),
  mk(25, "pokemon", 854, "Sinistea", "🍵", "#c084fc", ["Ghost"], "friendly", "moving objects", "low", 84, "kitchen", 1, false, 120, 2.3, "A haunted teacup. Sip with care: the tea brews a little too sweet."),
  mk(26, "pokemon", 885, "Dreepy", "🐉", "#22d3ee", ["Dragon", "Ghost"], "friendly", "whispers", "low", 82, "lighthouse", 1, false, 500, 5.5, "A tiny dragon ghost from an ancient sea, drifting between lighthouse windows."),
  mk(27, "pokemon", 608, "Lampent", "🕯️", "#a78bfa", ["Ghost", "Fire"], "neutral", "moving objects", "medium", 49, "mansion", 3, false, 150, 9.2, "A drifting chandelier light that follows the sleepy and softly dims as they doze."),
  mk(28, "pokemon", 609, "Chandelure", "🕍", "#7e22ce", ["Ghost", "Fire"], "vengeful", "full apparition", "high", 27, "mansion", 5, true, 410, 21.7, "Its flames enthrall guests into never leaving. Spectacular and dangerous."),
  mk(29, "pokemon", 622, "Golett", "🗿", "#14b8a6", ["Ground", "Ghost"], "neutral", "moving objects", "low", 64, "ruins", 2, false, 3000, 13.1, "An ancient clay golem that shuffles around the ruins awaiting orders."),
  mk(30, "pokemon", 426, "Drifblim", "🎈", "#a855f7", ["Ghost", "Flying"], "friendly", "full apparition", "low", 90, "graveyard", 1, false, 66, 1.1, "A gentle balloon that carries children on windy days, sometimes for the whole afternoon."),
  mk(31, "pokemon", 477, "Dusknoir", "👹", "#1e293b", ["Ghost"], "vengeful", "full apparition", "high", 32, "graveyard", 5, true, 500, 16.3, "Guides spirits to the other side with the antenna on its head and does not take no for an answer."),
  mk(32, "pokemon", 93, "Haunter", "😈", "#6d28d9", ["Ghost", "Poison"], "mischievous", "full apparition", "medium", 57, "basement", 3, false, 70, 3.6, "Floats through basement walls and loves a good prank."),
  mk(33, "pokemon", 570, "Zorua", "🦊", "#475569", ["Dark"], "mischievous", "full apparition", "low", 72, "forest", 2, false, 110, 4.9, "A shape-shifting fox cub that fakes spooky illusions to protect its den."),
  mk(34, "pokemon", 571, "Zoroark", "🦊", "#334155", ["Dark"], "neutral", "full apparition", "medium", 40, "forest", 4, true, 200, 10.4, "Illusion master of the woods. Will show you a vision you will never forget."),
  mk(35, "pokemon", 197, "Umbreon", "🌙", "#1e293b", ["Dark"], "friendly", "full apparition", "low", 83, "graveyard", 2, false, 45, 2.7, "Glows with moonlit rings and watches over night travelers."),
  mk(36, "pokemon", 198, "Murkrow", "🐦‍⬛", "#6d28d9", ["Dark", "Flying"], "mischievous", "whispers", "low", 60, "old church", 2, false, 25, 5.9, "A night crow that steals shiny objects from the sleeping."),
  mk(37, "pokemon", 724, "Decidueye", "🏹", "#15803d", ["Grass", "Ghost"], "neutral", "full apparition", "medium", 54, "forest", 4, false, 160, 12.8, "A silent archer of the woods. Never misses, never talks."),

  mk(38, "digimon", "Bakemon", "Bakemon", "👻", "#94a3b8", ["Dark", "Undead"], "mischievous", "full apparition", "low", 68, "abandoned hospital", 2, false, 80, 3.4, "A sheet-draped spirit that floats through ruined hallways and giggles at its own tricks."),
  mk(39, "digimon", "Ghostmon", "Ghostmon", "👻", "#818cf8", ["Dark", "Undead"], "neutral", "whispers", "medium", 51, "abandoned hospital", 3, false, 130, 6, "Haunts empty wards and talks in echoes."),
  mk(40, "digimon", "Phantomon", "Phantomon", "⚰️", "#4338ca", ["Dark", "Undead"], "vengeful", "full apparition", "high", 24, "graveyard", 5, true, 260, 19.6, "A scythe-wielding reaper from the digital graveyard. Its lantern shows who is next."),
  mk(41, "digimon", "Wizardmon", "Wizardmon", "🧙", "#6366f1", ["Magic", "Dark"], "friendly", "whispers", "low", 79, "library", 2, false, 150, 2.9, "A wandering spellcaster who protects friends no matter the cost."),
  mk(42, "digimon", "Myotismon", "Myotismon", "🧛", "#b91c1c", ["Dark", "Vampire"], "vengeful", "full apparition", "high", 15, "mansion", 5, true, 600, 27.4, "A vampire lord who rules the night from his mansion. Not for beginners."),
  mk(43, "digimon", "Demidevimon", "Demidevimon", "🦇", "#7e22ce", ["Dark"], "mischievous", "moving objects", "low", 58, "cave", 2, false, 33, 4.2, "A pesky little bat imp that spreads rumors and steals snacks."),
  mk(44, "digimon", "Soulmon", "Soulmon", "🔥", "#60a5fa", ["Undead", "Fire"], "friendly", "whispers", "low", 86, "swamp", 1, false, 70, 2, "A lonely wisp that guides lost souls through the swamp."),
  mk(45, "digimon", "Pumpmon", "Pumpmon", "🎃", "#fb923c", ["Dark", "Plant"], "mischievous", "moving objects", "medium", 52, "pumpkin patch", 3, false, 28, 5, "A pumpkin-headed prankster who guards the patch with treats and tricks."),
  mk(46, "digimon", "Impmon", "Impmon", "😈", "#a21caf", ["Dark"], "mischievous", "moving objects", "medium", 45, "basement", 3, false, 20, 7.6, "A cheeky imp who does not trust anyone at first. Earn his respect."),
  mk(47, "digimon", "Devimon", "Devimon", "👿", "#0f172a", ["Dark", "Demon"], "vengeful", "full apparition", "high", 20, "castle", 5, true, 700, 22.1, "Bound to a crumbling castle, where darkness itself bends to his will."),
];

export const LOCATIONS = [...new Set(GHOSTS.map((g) => g.location))].sort();
