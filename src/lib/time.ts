/** India Standard Time helpers shared by the client and the server. */

export function istNow() {
  const now = new Date();
  return new Date(now.getTime() + (now.getTimezoneOffset() + 330) * 60_000);
}

export function istDateKey(d = istNow()) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
    d.getDate(),
  ).padStart(2, "0")}`;
}

export function addDaysISO(days: number, from = istNow()) {
  const d = new Date(from);
  d.setDate(d.getDate() + days);
  return istDateKey(d);
}

/** Café is open 08:00 → 01:00 IST (01:00 treated as hour 25). */
export function openState(d = istNow()) {
  const minutes = d.getHours() * 60 + d.getMinutes();
  const open = 8 * 60;
  const close = 25 * 60; // 01:00 next day
  const normalised = minutes < 4 * 60 ? minutes + 24 * 60 : minutes;
  const isOpen = normalised >= open && normalised < close;
  const minsToOpen = normalised < open ? open - normalised : 24 * 60 + open - normalised;
  return {
    isOpen,
    minutes: normalised,
    label: isOpen ? "Pouring now" : "Doors closed",
    detail: isOpen
      ? `Last seating at 00:00 · ${Math.max(0, Math.round((close - normalised) / 60))} hrs left tonight`
      : `Doors open in ${Math.floor(minsToOpen / 60)}h ${minsToOpen % 60}m`,
  };
}

export function prettyDate(iso: string) {
  const [y, m, d] = iso.split("-").map(Number);
  const date = new Date(Date.UTC(y, (m ?? 1) - 1, d ?? 1));
  return date.toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    timeZone: "UTC",
  });
}

export function shortDate(iso: string) {
  const [y, m, d] = iso.split("-").map(Number);
  const date = new Date(Date.UTC(y, (m ?? 1) - 1, d ?? 1));
  return date.toLocaleDateString("en-IN", {
    weekday: "short",
    day: "numeric",
    month: "short",
    timeZone: "UTC",
  });
}

export function dayNumber(iso: string) {
  return iso.split("-")[2];
}

export function weekdayShort(iso: string) {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(Date.UTC(y, (m ?? 1) - 1, d ?? 1)).toLocaleDateString("en-IN", {
    weekday: "short",
    timeZone: "UTC",
  });
}

export function relativeTime(isoStamp: string) {
  const then = new Date(isoStamp).getTime();
  if (Number.isNaN(then)) return "";
  const diff = Date.now() - then;
  const mins = Math.round(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins} min ago`;
  const hrs = Math.round(mins / 60);
  if (hrs < 24) return `${hrs} hr ago`;
  return `${Math.round(hrs / 24)} d ago`;
}

/** Builds an .ics calendar file for a confirmed table. */
export function icsFor(opts: {
  code: string;
  date: string;
  slot: string;
  zone: string;
  guests: number;
}) {
  const [y, m, d] = opts.date.split("-").map(Number);
  const [hh, mm] = opts.slot.split(":").map(Number);
  const start = new Date(Date.UTC(y, (m ?? 1) - 1, d ?? 1, (hh ?? 19) - 5, (mm ?? 0) - 30));
  const end = new Date(start.getTime() + 2 * 60 * 60 * 1000);
  const fmt = (dt: Date) => dt.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//ABsip//Reservations//EN",
    "BEGIN:VEVENT",
    `UID:${opts.code}@absip.cafe`,
    `DTSTAMP:${fmt(new Date())}`,
    `DTSTART:${fmt(start)}`,
    `DTEND:${fmt(end)}`,
    `SUMMARY:ABsip — ${opts.zone} for ${opts.guests}`,
    `DESCRIPTION:Reservation ${opts.code}. Table held for 20 minutes past the seating time.`,
    "LOCATION:24 Pali Naka, Bandra West, Mumbai 400050",
    "END:VEVENT",
    "END:VCALENDAR",
  ];
  return lines.join("\r\n");
}
