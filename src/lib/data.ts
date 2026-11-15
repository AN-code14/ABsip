import { and, asc, count, desc, eq, ilike, inArray, or, sql } from "drizzle-orm";

import { db } from "@/db";
import {
  bookings,
  menuItems,
  orderItems,
  orders,
  waitlist,
  type Booking,
  type MenuItem,
  type Order,
  type OrderItem,
} from "@/db/schema";
import { MENU_SEED } from "@/db/seed-data";
import { PROMOS } from "@/lib/site";
import { toCard, type CardItem } from "@/lib/types";

export { PROMOS };

/* ─────────────────────────── helpers ─────────────────────────── */

export { inr, numberFmt } from "@/lib/money";

const ALPHABET = "ACDEFGHJKLMNPQRTUVWXY3479";

export function makeCode(prefix: string) {
  let out = "";
  for (let i = 0; i < 5; i += 1) {
    out += ALPHABET[Math.floor(Math.random() * ALPHABET.length)];
  }
  return `${prefix}-${out}`;
}

/* ─────────────────────────── lazy seed ─────────────────────────── */

let seedPromise: Promise<void> | null = null;

export function ensureSeeded(): Promise<void> {
  if (!seedPromise) {
    seedPromise = (async () => {
      try {
        const [row] = await db.select({ n: count() }).from(menuItems);
        if ((row?.n ?? 0) === 0) {
          await db.insert(menuItems).values(MENU_SEED);
        }
      } catch {
        seedPromise = null;
      }
    })();
  }
  return seedPromise;
}

/* ─────────────────────────── menu ─────────────────────────── */

export type MenuFilter = {
  category?: string;
  search?: string;
  vegOnly?: boolean;
  signatureOnly?: boolean;
};

export async function getMenu(filter: MenuFilter = {}): Promise<MenuItem[]> {
  await ensureSeeded();
  const clauses = [];
  if (filter.category && filter.category !== "All") clauses.push(eq(menuItems.category, filter.category));
  if (filter.vegOnly) clauses.push(eq(menuItems.isVeg, true));
  if (filter.signatureOnly) clauses.push(eq(menuItems.isSignature, true));
  if (filter.search) {
    const q = `%${filter.search}%`;
    clauses.push(
      or(ilike(menuItems.name, q), ilike(menuItems.description, q), ilike(menuItems.category, q))!,
    );
  }
  return db
    .select()
    .from(menuItems)
    .where(clauses.length ? and(...clauses) : sql`true`)
    .orderBy(asc(menuItems.sortOrder));
}

export async function getSignatures(limit = 6): Promise<MenuItem[]> {
  await ensureSeeded();
  return db
    .select()
    .from(menuItems)
    .where(eq(menuItems.isSignature, true))
    .orderBy(asc(menuItems.sortOrder))
    .limit(limit);
}

export async function getItemsByIds(ids: number[]): Promise<MenuItem[]> {
  await ensureSeeded();
  if (!ids.length) return [];
  return db.select().from(menuItems).where(inArray(menuItems.id, ids));
}

export async function getMenuCategories(): Promise<string[]> {
  await ensureSeeded();
  const rows = await db.selectDistinct({ category: menuItems.category }).from(menuItems);
  return rows.map((r) => r.category);
}

/* ─────────────────────────── bookings ─────────────────────────── */

export type BookingInput = {
  guestName: string;
  phone: string;
  email: string;
  date: string;
  slot: string;
  guests: number;
  zone: string;
  occasion?: string | null;
  requests?: string | null;
};

const SLOT_CAPACITY = 22;

export async function getSlotLoad(date: string) {
  await ensureSeeded();
  const rows = await db
    .select({ slot: bookings.slot, guests: sql<number>`sum(${bookings.guests})::int` })
    .from(bookings)
    .where(
      and(
        eq(bookings.date, date),
        inArray(bookings.status, ["requested", "confirmed", "seated"]),
      ),
    )
    .groupBy(bookings.slot);
  const map = new Map<string, number>();
  for (const r of rows) map.set(r.slot, r.guests ?? 0);
  return map;
}

export async function createBooking(input: BookingInput): Promise<Booking> {
  await ensureSeeded();
  const load = await getSlotLoad(input.date);
  const taken = load.get(input.slot) ?? 0;
  if (taken + input.guests > SLOT_CAPACITY) {
    throw new Error(
      `That seating is nearly full. ${SLOT_CAPACITY - taken > 0 ? `Only ${SLOT_CAPACITY - taken} seats remain at ${input.slot}.` : "Please choose another time."}`,
    );
  }
  const code = makeCode("TBL");
  const [row] = await db
    .insert(bookings)
    .values({ ...input, code, status: "confirmed" })
    .returning();
  return row;
}

export async function getBookings(limit = 60): Promise<Booking[]> {
  await ensureSeeded();
  return db.select().from(bookings).orderBy(desc(bookings.createdAt)).limit(limit);
}

export async function findBooking(code: string): Promise<Booking | undefined> {
  await ensureSeeded();
  const [row] = await db.select().from(bookings).where(eq(bookings.code, code.toUpperCase().trim()));
  return row;
}

export async function setBookingStatus(id: number, status: string): Promise<Booking | undefined> {
  const [row] = await db.update(bookings).set({ status }).where(eq(bookings.id, id)).returning();
  return row;
}

/* ─────────────────────────── orders ─────────────────────────── */

export type OrderLine = { menuItemId: number; quantity: number; note?: string | null };

export type OrderInput = {
  customerName: string;
  phone: string;
  email?: string | null;
  orderType: string;
  address?: string | null;
  tableNo?: string | null;
  preferredTime?: string | null;
  paymentMethod: string;
  notes?: string | null;
  promo?: string | null;
};



export type OrderWithItems = Order & { items: OrderItem[] };

export type Quote = {
  lines: { id: number; name: string; price: number; quantity: number; image: string }[];
  subtotal: number;
  discount: number;
  promoLabel: string | null;
  serviceFee: number;
  deliveryFee: number;
  tax: number;
  total: number;
  etaMinutes: number;
};

/** Prices the tray server-side so the client can never lie about the bill. */
export async function quoteOrder(
  input: { orderType: string; promo?: string | null },
  lines: OrderLine[],
): Promise<Quote> {
  await ensureSeeded();
  if (!lines.length) throw new Error("Your tray is empty.");

  const ids = lines.map((l) => l.menuItemId);
  const found = await getItemsByIds(ids);
  const byId = new Map(found.map((f) => [f.id, f]));

  let subtotal = 0;
  let longest = 0;
  const priced = lines.map((l) => {
    const item = byId.get(l.menuItemId);
    if (!item || !item.available) throw new Error("One of the items is no longer on the menu.");
    subtotal += item.price * l.quantity;
    longest = Math.max(longest, item.prepMinutes);
    return { id: item.id, name: item.name, price: item.price, quantity: l.quantity, image: item.image };
  });

  const promoKey = (input.promo ?? "").trim().toUpperCase();
  const promo = PROMOS[promoKey];
  const discount = promo ? Math.min(promo.cap, Math.round(subtotal * promo.off)) : 0;

  const deliveryFee = input.orderType === "delivery" ? (subtotal - discount >= 2500 ? 0 : 149) : 0;
  const serviceFee = input.orderType === "dine-in" ? Math.round((subtotal - discount) * 0.05) : 0;
  const tax = Math.round((subtotal - discount + serviceFee) * 0.05);
  const total = Math.max(0, subtotal - discount) + serviceFee + deliveryFee + tax;
  const etaMinutes =
    longest + (input.orderType === "delivery" ? 28 : input.orderType === "pickup" ? 6 : 4);

  return {
    lines: priced,
    subtotal,
    discount,
    promoLabel: promo ? promo.label : null,
    serviceFee,
    deliveryFee,
    tax,
    total,
    etaMinutes,
  };
}

export async function createOrder(input: OrderInput, lines: OrderLine[]) {
  const quote = await quoteOrder(input, lines);
  const byId = new Map(quote.lines.map((l) => [l.id, l]));
  const code = makeCode("ABS");

  const [order] = await db
    .insert(orders)
    .values({
      code,
      customerName: input.customerName,
      phone: input.phone,
      email: input.email ?? null,
      orderType: input.orderType,
      address: input.address ?? null,
      tableNo: input.tableNo ?? null,
      preferredTime: input.preferredTime ?? null,
      paymentMethod: input.paymentMethod,
      notes: input.notes ?? null,
      promo: input.promo ? input.promo.toUpperCase() : null,
      subtotal: quote.subtotal,
      discount: quote.discount,
      tax: quote.tax,
      serviceFee: quote.serviceFee,
      deliveryFee: quote.deliveryFee,
      total: quote.total,
      etaMinutes: quote.etaMinutes,
      status: "placed",
    })
    .returning();

  await db.insert(orderItems).values(
    lines.map((l) => {
      const item = byId.get(l.menuItemId)!;
      return {
        orderId: order.id,
        menuItemId: item.id,
        name: item.name,
        price: item.price,
        quantity: l.quantity,
        note: l.note ?? null,
      };
    }),
  );

  return { order, ...quote };
}

export async function getOrders(limit = 60): Promise<OrderWithItems[]> {
  await ensureSeeded();
  const rows = await db.select().from(orders).orderBy(desc(orders.createdAt)).limit(limit);
  if (!rows.length) return [];
  const items = await db
    .select()
    .from(orderItems)
    .where(inArray(orderItems.orderId, rows.map((r) => r.id)));
  return rows.map((r) => ({ ...r, items: items.filter((i) => i.orderId === r.id) }));
}

export async function findOrder(code: string): Promise<OrderWithItems | undefined> {
  await ensureSeeded();
  const [row] = await db.select().from(orders).where(eq(orders.code, code.toUpperCase().trim()));
  if (!row) return undefined;
  const items = await db.select().from(orderItems).where(eq(orderItems.orderId, row.id));
  return { ...row, items };
}

export async function setOrderStatus(id: number, status: string): Promise<Order | undefined> {
  const [row] = await db.update(orders).set({ status }).where(eq(orders.id, id)).returning();
  return row;
}

export async function getHouseStats() {
  await ensureSeeded();
  const [b] = await db.select({ n: count() }).from(bookings);
  const [o] = await db.select({ n: count() }).from(orders);
  const [m] = await db.select({ n: count() }).from(menuItems);
  const [revenue] = await db
    .select({ n: sql<number>`coalesce(sum(${orders.total}),0)::int` })
    .from(orders);
  return {
    bookings: b?.n ?? 0,
    orders: o?.n ?? 0,
    menuItems: m?.n ?? 0,
    revenue: revenue?.n ?? 0,
  };
}

export async function addWaitlistEntry(name: string, email: string, interest?: string) {
  const [row] = await db
    .insert(waitlist)
    .values({ name, email, interest: interest ?? null })
    .returning();
  return row;
}

export type { MenuItem, Booking, Order, OrderItem };

/* ─────────────── resilient read helpers (used by pages) ─────────────── */

export function seedCards(list = MENU_SEED): CardItem[] {
  return list.map((s, i) => ({
    id: 90000 + i,
    name: s.name,
    slug: s.slug,
    category: s.category,
    description: s.description,
    story: s.story ?? null,
    price: s.price,
    image: s.image,
    tags: s.tags,
    isVeg: s.isVeg,
    isSignature: s.isSignature,
    prepMinutes: s.prepMinutes,
    kcal: s.kcal ?? null,
    pairing: s.pairing ?? null,
    origin: s.origin ?? null,
  }));
}

/** Menu straight from Postgres; falls back to the seed list if the DB is cold. */
export async function getMenuSafe(filter: MenuFilter = {}): Promise<CardItem[]> {
  try {
    const rows = await getMenu(filter);
    if (rows.length) return rows.map(toCard);
  } catch {
    /* fall through to seed */
  }
  let list = seedCards();
  if (filter.category && filter.category !== "All") list = list.filter((l) => l.category === filter.category);
  if (filter.vegOnly) list = list.filter((l) => l.isVeg);
  if (filter.signatureOnly) list = list.filter((l) => l.isSignature);
  if (filter.search) {
    const q = filter.search.toLowerCase();
    list = list.filter(
      (l) =>
        l.name.toLowerCase().includes(q) ||
        l.description.toLowerCase().includes(q) ||
        l.category.toLowerCase().includes(q),
    );
  }
  return list;
}

export async function getSignaturesSafe(limit = 6): Promise<CardItem[]> {
  try {
    const rows = await getSignatures(limit);
    if (rows.length) return rows.map(toCard);
  } catch {
    /* fall through to seed */
  }
  return seedCards().filter((l) => l.isSignature).slice(0, limit);
}

export async function getCategoriesSafe(): Promise<string[]> {
  try {
    const rows = await getMenuCategories();
    if (rows.length) return rows;
  } catch {
    /* fall through to seed */
  }
  return Array.from(new Set(MENU_SEED.map((s) => s.category)));
}
