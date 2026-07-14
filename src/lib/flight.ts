/*
 * The one demo flight that threads the whole page. Every number is real:
 * airports from the app's airports.json, distances great-circle, durations
 * from the app's formula (km / 850 km/h + 15 min taxi).
 *
 * WS 214 · TKS → HND · 498 km / 309 mi · 50 MIN — a 50-minute session,
 * Tokushima to Tokyo Haneda. Eight minutes after takeoff the menu bar
 * reads "WS214 · 42m → HND", exactly like PLAN.md's example.
 */

export const FLIGHT = {
  number: "WS 214",
  origin: {
    iata: "TKS",
    city: "TOKUSHIMA",
    airport: "TOKUSHIMA AWAODORI AIRPORT",
    tz: "Asia/Tokyo",
  },
  dest: {
    iata: "HND",
    city: "TOKYO",
    airport: "HANEDA INTL",
    tz: "Asia/Tokyo",
  },
  km: 498,
  mi: 309,
  minutes: 50,
  gate: "B4",
  seat: "23A · WINDOW",
  cabin: "ECONOMY",
  task: "DEEP WORK",
} as const;

export type BoardRow = {
  flight: string;
  gate: string;
  dest: string;
  sub: string;
  route: string;
  seatClass: "WORK" | "STUDY" | "READ" | "CREATE";
  tz: string | null;
  duration: string;
  remark: string;
  picked?: boolean;
  newStamp?: boolean;
  standby?: boolean;
};

/* All real routes out of TKS; durations computed with the app formula. */
export const BOARD_ROWS: BoardRow[] = [
  {
    flight: "WS 181",
    gate: "A7",
    dest: "TAIPEI",
    sub: "TAOYUAN INTL · TAIWAN",
    route: "TKS → TPE",
    seatClass: "READ",
    tz: "Asia/Taipei",
    duration: "130 MIN",
    remark: "ON TIME",
  },
  {
    flight: "WS 214",
    gate: "B4",
    dest: "TOKYO",
    sub: "HANEDA INTL · JAPAN",
    route: "TKS → HND",
    seatClass: "WORK",
    tz: "Asia/Tokyo",
    duration: "50 MIN",
    remark: "BOARDING",
    picked: true,
  },
  {
    flight: "WS 353",
    gate: "C2",
    dest: "BUSAN",
    sub: "GIMHAE INTL · SOUTH KOREA",
    route: "TKS → PUS",
    seatClass: "STUDY",
    tz: "Asia/Seoul",
    duration: "53 MIN",
    remark: "ON TIME",
    newStamp: true,
  },
  {
    flight: "WS ···",
    gate: "—",
    dest: "ANYWHERE",
    sub: "RANDOM DESTINATION",
    route: "TKS → ???",
    seatClass: "CREATE",
    tz: null,
    duration: "?? MIN",
    remark: "STANDBY",
    standby: true,
  },
];

export const SEAT_CLASS_COLOR: Record<BoardRow["seatClass"], string> = {
  WORK: "var(--color-seatwork)",
  STUDY: "var(--color-seatstudy)",
  READ: "var(--color-seatread)",
  CREATE: "var(--color-seatcreate)",
};

/*
 * The real TKS → HND great-circle, slerped in 3D and projected
 * (equirectangular, cos-lat corrected) into a 1000×520 viewBox.
 */
export const GC_POLYLINE =
  "140.0,420.0 162.1,411.9 184.3,403.9 206.4,395.9 228.6,388.0 250.8,380.1 " +
  "273.1,372.2 295.3,364.3 317.6,356.5 340.0,348.8 362.3,341.0 384.7,333.3 " +
  "407.0,325.7 429.5,318.0 451.9,310.4 474.4,302.9 496.8,295.4 519.4,287.9 " +
  "541.9,280.4 564.5,273.0 587.0,265.6 609.6,258.3 632.3,251.0 654.9,243.7 " +
  "677.6,236.5 700.3,229.3 723.0,222.1 745.8,215.0 768.6,207.9 791.4,200.9 " +
  "814.2,193.9 837.0,186.9 859.9,180.0";

export function gcPathD(): string {
  const pts = GC_POLYLINE.split(" ");
  return "M" + pts[0] + " L" + pts.slice(1).join(" L");
}

/* Multi-leg example for the craft chapter — also real numbers. */
export const MULTI_LEG = [
  { label: "LEG 1", route: "TKS → NGO", detail: "NAGOYA CENTRAIR · 30 MIN" },
  { label: "BREAK", route: "CHANGE PLANES", detail: "STRETCH · WATER · 10 MIN" },
  { label: "LEG 2", route: "NGO → HND", detail: "TOKYO HANEDA · 35 MIN" },
];

export function formatCountdown(secondsLeft: number): string {
  const s = Math.max(0, Math.round(secondsLeft));
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${pad(h)}:${pad(m)}:${pad(sec)}`;
}
