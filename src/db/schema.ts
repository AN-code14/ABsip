import { sql } from "drizzle-orm";
import {
  boolean,
  date,
  integer,
  pgTable,
  serial,
  text,
  timestamp,
} from "drizzle-orm/pg-core";

export const menuItems = pgTable("menu_items", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  category: text("category").notNull(),
  description: text("description").notNull(),
  story: text("story"),
  price: integer("price").notNull(),
  image: text("image").notNull(),
  tags: text("tags").array().notNull(),
  isVeg: boolean("is_veg").notNull().default(true),
  isSignature: boolean("is_signature").notNull().default(false),
  prepMinutes: integer("prep_minutes").notNull().default(8),
  kcal: integer("kcal"),
  pairing: text("pairing"),
  origin: text("origin"),
  available: boolean("available").notNull().default(true),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const bookings = pgTable("bookings", {
  id: serial("id").primaryKey(),
  code: text("code").notNull().unique(),
  guestName: text("guest_name").notNull(),
  phone: text("phone").notNull(),
  email: text("email").notNull(),
  date: date("date").notNull(),
  slot: text("slot").notNull(),
  guests: integer("guests").notNull(),
  zone: text("zone").notNull(),
  occasion: text("occasion"),
  requests: text("requests"),
  status: text("status").notNull().default("requested"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  code: text("code").notNull().unique(),
  customerName: text("customer_name").notNull(),
  phone: text("phone").notNull(),
  email: text("email"),
  orderType: text("order_type").notNull(),
  address: text("address"),
  tableNo: text("table_no"),
  preferredTime: text("preferred_time"),
  paymentMethod: text("payment_method").notNull(),
  notes: text("notes"),
  promo: text("promo"),
  subtotal: integer("subtotal").notNull(),
  discount: integer("discount").notNull().default(0),
  tax: integer("tax").notNull(),
  serviceFee: integer("service_fee").notNull().default(0),
  deliveryFee: integer("delivery_fee").notNull().default(0),
  total: integer("total").notNull(),
  status: text("status").notNull().default("placed"),
  etaMinutes: integer("eta_minutes").notNull().default(30),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const orderItems = pgTable("order_items", {
  id: serial("id").primaryKey(),
  orderId: integer("order_id")
    .notNull()
    .references(() => orders.id, { onDelete: "cascade" }),
  menuItemId: integer("menu_item_id"),
  name: text("name").notNull(),
  price: integer("price").notNull(),
  quantity: integer("quantity").notNull(),
  note: text("note"),
});

export const waitlist = pgTable("waitlist", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  interest: text("interest"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export type MenuItem = typeof menuItems.$inferSelect;
export type Booking = typeof bookings.$inferSelect;
export type Order = typeof orders.$inferSelect;
export type OrderItem = typeof orderItems.$inferSelect;

export const ORDER_FLOW = ["placed", "confirmed", "preparing", "plated", "out"] as const;
export const BOOKING_FLOW = ["requested", "confirmed", "seated", "completed", "cancelled"] as const;

export const orderCountExpr = sql<number>`count(*)::int`;
