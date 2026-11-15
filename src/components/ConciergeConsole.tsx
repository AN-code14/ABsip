"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";

import { ArrowRight, CalendarIcon, ChairIcon, NoteIcon, SearchIcon, SparkIcon, TrayIcon, WhatsAppIcon } from "@/components/Icons";
import { inr, numberFmt } from "@/lib/money";
import { istDateKey, prettyDate, relativeTime } from "@/lib/time";
import { waLink } from "@/lib/site";

type Booking = {
  id: number;
  code: string;
  guestName: string;
  phone: string;
  email: string;
  date: string;
  slot: string;
  guests: number;
  zone: string;
  occasion: string | null;
  requests: string | null;
  status: string;
  createdAt: string;
};

type Order = {
  id: number;
  code: string;
  customerName: string;
  phone: string;
  orderType: string;
  address: string | null;
  tableNo: string | null;
  paymentMethod: string;
  notes: string | null;
  subtotal: number;
  discount: number;
  total: number;
  status: string;
  etaMinutes: number;
  createdAt: string;
  items: { id: number; name: string; quantity: number; price: number }[];
};

const ORDER_FLOW = ["placed", "confirmed", "preparing", "plated", "out"];
const BOOKING_FLOW = ["requested", "confirmed", "seated", "completed", "cancelled"];

export default function ConciergeConsole() {
  const [tab, setTab] = useState<"overview" | "tables" | "orders">("overview");
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [dateFilter, setDateFilter] = useState(istDateKey());
  const [lastSync, setLastSync] = useState<Date | null>(null);

  const load = useCallback(async (quiet = false) => {
    if (!quiet) setLoading(true);
    setError("");
    try {
      const [b, o] = await Promise.all([fetch("/api/bookings?limit=80"), fetch("/api/orders?limit=80")]);
      const bd = (await b.json()) as { ok?: boolean; bookings?: Booking[]; error?: string };
      const od = (await o.json()) as { ok?: boolean; orders?: Order[]; error?: string };
      if (!b.ok || !o.ok) throw new Error(bd.error ?? od.error ?? "Could not reach the desk.");
      setBookings(bd.bookings ?? []);
      setOrders(od.orders ?? []);
      setLastSync(new Date());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not reach the desk.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
    const t = window.setInterval(() => void load(true), 20_000);
    return () => window.clearInterval(t);
  }, [load]);

  async function patch(kind: "booking" | "order", code: string, status: string) {
    setBusy(code);
    try {
      const res = await fetch(`/api/${kind === "booking" ? "bookings" : "orders"}/${code}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error("Update rejected");
      await load(true);
    } catch {
      setError(`Could not update ${code}. The desk may be offline.`);
    } finally {
      setBusy(null);
    }
  }

  const today = istDateKey();

  const tonightsTables = useMemo(
    () => bookings.filter((b) => b.date === dateFilter && b.status !== "cancelled"),
    [bookings, dateFilter],
  );
  const liveOrders = useMemo(
    () => orders.filter((o) => o.status !== "out"),
    [orders],
  );
  const revenue = useMemo(() => orders.reduce((n, o) => n + o.total, 0), [orders]);
  const covers = useMemo(() => tonightsTables.reduce((n, b) => n + b.guests, 0), [tonightsTables]);

  const filteredBookings = useMemo(() => {
    const q = query.trim().toLowerCase();
    return bookings
      .filter((b) => (dateFilter === "all" ? true : b.date === dateFilter))
      .filter((b) =>
        q ? `${b.guestName} ${b.code} ${b.zone} ${b.phone}`.toLowerCase().includes(q) : true,
      )
      .sort((a, b) => `${a.date}${a.slot}`.localeCompare(`${b.date}${b.slot}`));
  }, [bookings, query, dateFilter]);

  const filteredOrders = useMemo(() => {
    const q = query.trim().toLowerCase();
    return orders.filter((o) =>
      q ? `${o.customerName} ${o.code} ${o.orderType}`.toLowerCase().includes(q) : true,
    );
  }, [orders, query]);

  const dates = useMemo(() => {
    const set = new Set(bookings.map((b) => b.date));
    set.add(today);
    return ["all", ...Array.from(set).sort()];
  }, [bookings, today]);

  return (
    <div>
      {/* stat strip */}
      <div className="grid gap-px overflow-hidden rounded-xl border border-gold/15 bg-gold/12 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { icon: <ChairIcon className="h-4 w-4" />, k: numberFmt(tonightsTables.length), v: dateFilter === "all" ? "Tables booked" : `Tables · ${prettyDate(dateFilter).split(",")[0]}` },
          { icon: <SparkIcon className="h-4 w-4" />, k: numberFmt(covers), v: "Covers expected" },
          { icon: <TrayIcon className="h-4 w-4" />, k: numberFmt(liveOrders.length), v: "Tickets on the pass" },
          { icon: <NoteIcon className="h-4 w-4" />, k: inr(revenue), v: "Order value logged" },
        ].map((s) => (
          <div key={s.v} className="bg-espresso px-6 py-6">
            <span className="text-gold/75">{s.icon}</span>
            <p className="mt-3 font-display text-3xl leading-none text-gilt tabular-nums">{s.k}</p>
            <p className="label-xs mt-2 text-muted">{s.v}</p>
          </div>
        ))}
      </div>

      {/* controls */}
      <div className="mt-8 flex flex-col gap-4 rounded-xl border border-gold/15 bg-espresso/70 p-4 lg:flex-row lg:items-center">
        <div className="flex gap-2">
          {(["overview", "tables", "orders"] as const).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTab(t)}
              className={`rounded-full px-5 py-2.5 text-[10.5px] font-semibold tracking-[0.2em] uppercase transition ${
                tab === t ? "bg-gold text-ink" : "border border-gold/20 text-cream/65 hover:border-gold/60 hover:text-cream"
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:items-center">
          <div className="flex flex-1 items-center gap-2.5 rounded-full border border-gold/20 bg-mocha px-4 py-2.5">
            <SearchIcon className="h-4 w-4 shrink-0 text-gold/70" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search name, code or zone…"
              aria-label="Search the desk"
              className="w-full bg-transparent text-[13px] text-cream placeholder:text-muted/55 focus:outline-none"
            />
          </div>

          <select
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            aria-label="Filter by date"
            className="rounded-full border border-gold/20 bg-mocha px-4 py-2.5 text-[11px] tracking-[0.14em] text-cream uppercase focus:border-gold focus:outline-none"
          >
            {dates.map((d) => (
              <option key={d} value={d}>
                {d === "all" ? "All dates" : prettyDate(d)}
              </option>
            ))}
          </select>

          <button
            type="button"
            onClick={() => void load()}
            className="flex items-center justify-center gap-2 rounded-full border border-gold/25 px-5 py-2.5 text-[10.5px] font-semibold tracking-[0.18em] text-cream uppercase transition hover:border-gold hover:bg-gold/10"
          >
            <CalendarIcon className={`h-4 w-4 text-gold ${loading ? "animate-spin" : ""}`} />
            {loading ? "Syncing" : "Refresh"}
          </button>
        </div>
      </div>

      {error ? (
        <p className="mt-4 rounded-lg border border-oxblood/45 bg-oxblood/10 px-4 py-3 text-[13px] text-cream/80">
          {error}
        </p>
      ) : null}

      <p className="mt-3 text-[11px] tracking-[0.16em] text-muted uppercase">
        {lastSync ? `Synced ${relativeTime(lastSync.toISOString())} · auto-refresh every 20s` : "Connecting to the desk…"}
      </p>

      {/* OVERVIEW */}
      {tab === "overview" ? (
        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          <Panel title="Next tables" icon={<ChairIcon className="h-4 w-4" />}>
            {loading && !bookings.length ? (
              <Skeletons rows={4} />
            ) : tonightsTables.length ? (
              <ul className="divide-y divide-gold/10">
                {tonightsTables.slice(0, 6).map((b) => (
                  <li key={b.id} className="flex items-center justify-between gap-4 py-3">
                    <div>
                      <p className="text-[14px] text-cream">{b.guestName}</p>
                      <p className="text-[11.5px] text-muted">
                        {b.slot} · {b.guests} guests · {b.zone}
                      </p>
                    </div>
                    <span className="rounded-full border border-gold/20 px-3 py-1 text-[9.5px] tracking-[0.16em] text-champagne uppercase">
                      {b.status}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <Empty text={`No tables booked for ${dateFilter === "all" ? "any date" : prettyDate(dateFilter)} yet.`} />
            )}
          </Panel>

          <Panel title="Live tickets" icon={<TrayIcon className="h-4 w-4" />}>
            {loading && !orders.length ? (
              <Skeletons rows={4} />
            ) : liveOrders.length ? (
              <ul className="divide-y divide-gold/10">
                {liveOrders.slice(0, 6).map((o) => (
                  <li key={o.id} className="flex items-center justify-between gap-4 py-3">
                    <div>
                      <p className="font-mono text-[12.5px] tracking-[0.12em] text-gold">{o.code}</p>
                      <p className="text-[13px] text-cream">
                        {o.customerName} · {o.items.length} items · {inr(o.total)}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="rounded-full border border-sage/35 bg-sage/10 px-3 py-1 text-[9.5px] tracking-[0.16em] text-sage uppercase">
                        {o.status}
                      </span>
                      <button
                        type="button"
                        disabled={busy === o.code}
                        onClick={() => patch("order", o.code, ORDER_FLOW[Math.min(ORDER_FLOW.length - 1, ORDER_FLOW.indexOf(o.status) + 1)])}
                        className="rounded-full border border-gold/25 p-2 text-cream/70 transition hover:border-gold hover:text-champagne disabled:opacity-40"
                        aria-label="Advance order"
                      >
                        <ArrowRight className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <Empty text="No tickets on the pass. Every order is served." />
            )}
          </Panel>
        </div>
      ) : null}

      {/* TABLES */}
      {tab === "tables" ? (
        <div className="mt-8 overflow-hidden rounded-xl border border-gold/15">
          {loading && !bookings.length ? (
            <Skeletons rows={6} />
          ) : filteredBookings.length ? (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[860px] text-left">
                <thead className="bg-espresso">
                  <tr className="label-xs text-gold/85">
                    <th className="px-5 py-4 font-medium">Code</th>
                    <th className="px-5 py-4 font-medium">Guest</th>
                    <th className="px-5 py-4 font-medium">When</th>
                    <th className="px-5 py-4 font-medium">Party</th>
                    <th className="px-5 py-4 font-medium">Zone</th>
                    <th className="px-5 py-4 font-medium">Contact</th>
                    <th className="px-5 py-4 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gold/10 bg-mocha/30">
                  {filteredBookings.map((b) => (
                    <tr key={b.id} className="transition hover:bg-mocha/60">
                      <td className="px-5 py-4 font-mono text-[12px] tracking-[0.1em] text-gold">{b.code}</td>
                      <td className="px-5 py-4">
                        <p className="text-[13.5px] text-cream">{b.guestName}</p>
                        {b.occasion ? <p className="text-[11px] text-muted">{b.occasion}</p> : null}
                      </td>
                      <td className="px-5 py-4 text-[13px] text-cream/75">
                        {prettyDate(b.date)}
                        <span className="block text-[11.5px] text-muted tabular-nums">{b.slot}</span>
                      </td>
                      <td className="px-5 py-4 text-[13px] text-cream/75 tabular-nums">{b.guests}</td>
                      <td className="px-5 py-4 text-[13px] text-cream/75">{b.zone}</td>
                      <td className="px-5 py-4">
                        <a
                          href={waLink(`Hello ${b.guestName}, this is ABsip regarding reservation ${b.code}.`)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 text-[12px] text-cream/70 transition hover:text-champagne"
                        >
                          <WhatsAppIcon className="h-3.5 w-3.5 text-[#25D366]" />
                          {b.phone}
                        </a>
                      </td>
                      <td className="px-5 py-4">
                        <select
                          value={b.status}
                          disabled={busy === b.code}
                          onChange={(e) => patch("booking", b.code, e.target.value)}
                          className="rounded-full border border-gold/25 bg-espresso px-3 py-1.5 text-[10.5px] tracking-[0.14em] text-cream uppercase focus:border-gold focus:outline-none disabled:opacity-50"
                        >
                          {BOOKING_FLOW.map((s) => (
                            <option key={s} value={s}>
                              {s}
                            </option>
                          ))}
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <Empty text="No reservations match that filter." />
          )}
        </div>
      ) : null}

      {/* ORDERS */}
      {tab === "orders" ? (
        <div className="mt-8 space-y-4">
          {loading && !orders.length ? (
            <Skeletons rows={5} />
          ) : filteredOrders.length ? (
            filteredOrders.map((o) => (
              <article key={o.id} className="rounded-xl border border-gold/15 bg-mocha/35 p-5 transition hover:border-gold/35">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <p className="font-mono text-[12.5px] tracking-[0.12em] text-gold">{o.code}</p>
                    <p className="mt-1 font-display text-xl text-cream">{o.customerName}</p>
                    <p className="mt-1 text-[12px] text-muted">
                      {o.orderType === "dine-in"
                        ? `Table ${o.tableNo ?? "—"}`
                        : o.orderType === "delivery"
                          ? (o.address ?? "Delivery")
                          : "Collect at the pass"}{" "}
                      · {o.paymentMethod.toUpperCase()} · {relativeTime(o.createdAt)} · ETA {o.etaMinutes} min
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-display text-xl text-champagne tabular-nums">{inr(o.total)}</p>
                    {o.discount ? <p className="text-[11px] text-sage tabular-nums">− {inr(o.discount)} promo</p> : null}
                    <p className="text-[11px] text-muted tabular-nums">subtotal {inr(o.subtotal)}</p>
                  </div>
                </div>

                <ul className="mt-4 flex flex-wrap gap-2">
                  {o.items.map((l) => (
                    <li key={l.id} className="rounded-full border border-gold/15 bg-espresso px-3 py-1.5 text-[11.5px] text-cream/70">
                      <span className="mr-1.5 text-gold tabular-nums">{l.quantity}×</span>
                      {l.name}
                    </li>
                  ))}
                </ul>

                {o.notes ? <p className="mt-3 text-[12.5px] text-cream/55 italic">“{o.notes}”</p> : null}

                <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-gold/12 pt-4">
                  {ORDER_FLOW.map((s) => (
                    <button
                      key={s}
                      type="button"
                      disabled={busy === o.code}
                      onClick={() => patch("order", o.code, s)}
                      className={`rounded-full border px-3.5 py-1.5 text-[9.5px] tracking-[0.16em] uppercase transition disabled:opacity-50 ${
                        o.status === s
                          ? "border-gold bg-gold text-ink"
                          : "border-gold/18 text-cream/55 hover:border-gold/60 hover:text-cream"
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                  <Link
                    href={`/track?code=${o.code}`}
                    className="ml-auto flex items-center gap-2 text-[10.5px] tracking-[0.16em] text-gold uppercase transition hover:text-champagne"
                  >
                    Guest view <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </article>
            ))
          ) : (
            <Empty text="No orders yet. Place one from the menu and it lands here instantly." />
          )}
        </div>
      ) : null}
    </div>
  );
}

function Panel({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <section className="rounded-xl border border-gold/15 bg-espresso/70 p-6">
      <h2 className="label-xs flex items-center gap-2 text-gold">
        {icon} {title}
      </h2>
      <div className="mt-4">{children}</div>
    </section>
  );
}

function Empty({ text }: { text: string }) {
  return (
    <div className="rounded-lg border border-dashed border-gold/20 px-5 py-8 text-center">
      <p className="text-[13px] text-cream/50">{text}</p>
    </div>
  );
}

function Skeletons({ rows }: { rows: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="h-12 animate-pulse rounded-lg border border-gold/10 bg-mocha/40" />
      ))}
    </div>
  );
}
