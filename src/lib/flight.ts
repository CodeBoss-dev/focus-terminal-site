/*
 * The one demo session the page shows, in the app's own terms. Every number is
 * real: airports from the app's airports.json, distance great-circle, duration
 * from the app's formula (km / 850 km/h + 15 min taxi).
 *
 * FT 214 · TKS → HND · 498 km / 309 mi · 50 MIN — a fifty-minute session from
 * Tokushima to Tokyo Haneda. Eight minutes after takeoff the menu bar reads
 * "FT214 · 42m → HND", which is the strip shown in the in-flight section.
 *
 * The board rows, great-circle polyline and multi-leg example that used to live
 * here went with the sections that drew them.
 */
export const FLIGHT = {
  number: "FT 214",
  origin: {
    iata: "TKS",
    city: "TOKUSHIMA",
  },
  dest: {
    iata: "HND",
    city: "TOKYO",
  },
  km: 498,
  minutes: 50,
  gate: "B4",
  task: "DEEP WORK",
} as const;
