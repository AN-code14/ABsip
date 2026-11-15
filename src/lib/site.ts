export const WA_NUMBER = "918390325653";

export function waLink(message?: string) {
  const base = `https://wa.me/${WA_NUMBER}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}

export const CAFE = {
  name: "ABsip",
  wordmark: "ABsip",
  tagline: "A single-origin sanctuary",
  established: "MMXIX",
  addressLine1: "24 Pali Naka, Hill Road",
  addressLine2: "Bandra West, Mumbai 400050",
  phoneDisplay: "+91 83903 25653",
  phoneRaw: "+918390325653",
  email: "reserve@absip.cafe",
  concierge: "The Concierge Desk",
  hours: [
    { day: "Monday", time: "08:00 — 01:00", note: "Slow mornings" },
    { day: "Tuesday", time: "08:00 — 01:00", note: "Vinyl evenings" },
    { day: "Wednesday", time: "08:00 — 01:00", note: "Cupping lab" },
    { day: "Thursday", time: "08:00 — 02:00", note: "Chef's table" },
    { day: "Friday", time: "08:00 — 03:00", note: "Terrace noir" },
    { day: "Saturday", time: "09:00 — 03:00", note: "Late service" },
    { day: "Sunday", time: "09:00 — 00:00", note: "Brunch ritual" },
  ],
  openHour: 8,
  closeHour: 25, // 01:00 next day
};

export const ZONES = [
  {
    id: "window-gallery",
    name: "The Window Gallery",
    seats: "2 — 4 guests",
    priceNote: "No minimum",
    blurb:
      "Arched teak windows, brass reading lamps and a two-seat banquette cut from a single slab of Burma teak.",
    tone: "Daylight · Quiet · Best for one cup and one book",
  },
  {
    id: "library",
    name: "The Library",
    seats: "2 — 6 guests",
    priceNote: "₹1,500 per guest redeemable",
    blurb:
      "Floor-to-ceiling walnut shelving, 1,400 volumes, ladder access and a velvet chaise for long conversations.",
    tone: "Hushed · Candle-lit · Long pour service",
  },
  {
    id: "terrace-noir",
    name: "Terrace Noir",
    seats: "2 — 10 guests",
    priceNote: "₹2,500 per guest redeemable",
    blurb:
      "Open sky over the Arabian Sea, black marble tables, olive trees in copper planters and a live oud player on weekends.",
    tone: "Breeze · Sea view · Sunset seating",
  },
  {
    id: "chefs-counter",
    name: "The Chef's Counter",
    seats: "1 — 4 guests",
    priceNote: "Tasting menu only",
    blurb:
      "Six stools facing the pass. Watch the plating, ask questions, eat what the kitchen is proud of tonight.",
    tone: "Interactive · 9 courses · 2 hrs",
  },
  {
    id: "private-salon",
    name: "The Private Salon",
    seats: "6 — 18 guests",
    priceNote: "₹18,000 room fee",
    blurb:
      "A sealed room in oxblood leather with its own barista, dedicated sound system and a hand-written menu.",
    tone: "Events · Buyouts · Celebrations",
  },
  {
    id: "roastery",
    name: "The Roastery Loft",
    seats: "2 — 8 guests",
    priceNote: "Cupping add-on ₹900",
    blurb:
      "Sit inside the working roastery above the café. Green-bean sacks, Probat drum, and the smell of first crack.",
    tone: "Aromatic · Cupping sessions · Tours",
  },
] as const;

export const SLOT_GROUPS = [
  {
    label: "Morning Ritual",
    slots: ["08:00", "08:45", "09:30", "10:15", "11:00", "11:45"],
  },
  {
    label: "Afternoon Pour",
    slots: ["12:30", "13:15", "14:00", "15:00", "16:00", "17:00"],
  },
  {
    label: "Evening Service",
    slots: ["18:00", "18:45", "19:30", "20:15", "21:00", "21:45"],
  },
  {
    label: "Late Noir",
    slots: ["22:30", "23:15", "00:00"],
  },
] as const;

export const ALL_SLOTS = SLOT_GROUPS.flatMap((g) => [...g.slots]);

export const OCCASIONS = [
  "No occasion — just coffee",
  "Birthday",
  "Anniversary",
  "Business meeting",
  "Proposal",
  "First date",
  "Celebration",
] as const;

export const ORDER_TYPES = [
  {
    id: "dine-in",
    name: "At my table",
    detail: "Served to your reserved table number",
    eta: "12 — 18 min",
    fee: 0,
  },
  {
    id: "pickup",
    name: "Collect in person",
    detail: "Ready at the marble pass, Hill Road entrance",
    eta: "15 — 20 min",
    fee: 0,
  },
  {
    id: "delivery",
    name: "Concierge delivery",
    detail: "Within 6 km of Bandra West, in thermal lacquer boxes",
    eta: "35 — 50 min",
    fee: 149,
  },
] as const;

export const PROMOS: Record<string, { off: number; cap: number; label: string; note: string }> = {
  ABSIP10: { off: 0.1, cap: 600, label: "10% off", note: "Up to ₹600, any service style" },
  FIRSTPOUR: { off: 0.15, cap: 450, label: "15% off first tray", note: "New guests only, up to ₹450" },
  TERRACE25: { off: 0.25, cap: 1000, label: "25% off terrace", note: "Dine-in orders after 21:00" },
};

export const PAYMENT_METHODS = [
  { id: "upi", name: "UPI on delivery", detail: "QR sent to your phone" },
  { id: "card", name: "Card at the table", detail: "Amex · Visa · RuPay" },
  { id: "cash", name: "Cash", detail: "Exact change appreciated" },
  { id: "tab", name: "Members' tab", detail: "For Salon members only" },
] as const;
