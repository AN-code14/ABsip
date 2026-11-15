"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

import {
  ArrowRight,
  CalendarIcon,
  ChairIcon,
  CheckIcon,
  ClockIcon,
  NoteIcon,
  SearchIcon,
  SparkIcon,
  WhatsAppIcon,
} from "@/components/Icons";
import { inr } from "@/lib/money";
import { icsFor, prettyDate, relativeTime } from "@/lib/time";
import { waLink } from "@/lib/site";

type OrderLine = { id: number; name: string; price: number; quantity: number; note: string | null };
type FoundOrder = {
  code: string;
  status: string;
  customerName: string;
  orderType: string;
  address: string | null;
  tableNo: string | null;
  preferredTime: string | null;
  paymentMethod: string;
  notes: string | null;
  subtotal: number;
  discount: number;
  tax: number;
  serviceFee: number;
  deliveryFee: number;
  total: number;
  etaMinutes: number;
  createdAt: string;
  items: OrderLine[];
};
type FoundBooking = {
  code: string;
  status: string;
  guestName: string;
  phone: string;
  email: string;
  date: string;
  slot: string;
  guests: number;
  zone: string;
  occasion: string | null;
  requests: string | null;
  createdAt: string;
};

const ORDER_FLOW = [
  { key: "placed", label: "Order received", note: "The concierge has your ticket" },
  { key: "confirmed", label: "Kitchen confirmed", note: "Stock checked, fire lit" },
  { key: "preparing", label: "In preparation", note: "Your barista and chef are on it" },
  { key: "plated", label: "Plated & packed", note: "Lacquer box sealed, card written" },
  { key: "out", label: "With you", note: "Handed over — enjoy" },
];

const BOOKING_FLOW = [
  { key: "requested", label: "Requested" },
  { key: "confirmed", label: "Confirmed" },
  { key: "seated", label: "Seated" },
  { key: "completed", label: "Completed" },
];

export default function Tracker() {
  const params = useSearchParams();
  const initial = (params.get("code") ?? "").toUpperCase();
  const [code, setCode] = useState(initial);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [order, setOrder] = useState<FoundOrder | null>(null);
  const [booking, setBooking] = useState<FoundBooking | null>(null);

  const lookup = useCallback(
    async (target?: string, quiet = false) => {
      const value = (target ?? code).trim().toUpperCase();
      if (value.length < 4) {
        if (!quiet) setError("Enter the code from your confirmation, e.g. ABS-4K2QP.");
        return;
      }
      if (!quiet) setLoading(true);
      setError("");
      try {
        const o = await fetch(`/api/orders/${value}`);
        if (o.ok) {
          const data = (await o.json()) as { ok?: boolean; order?: FoundOrder };
          if (data.ok && data.order) {
            setOrder(data.order);
            setBooking(null);
            return;
          }
        }
        const b = await fetch(`/api/bookings/${value}`);
        if (b.ok) {
          const data = (await b.json()) as { ok?: boolean; booking?: FoundBooking };
          if (data.ok && data.booking) {
            setBooking(data.booking);
            setOrder(null);
            return;
          }
        }
        setOrder(null);
        setBooking(null);
        setError(`Nothing found under ${value}. Check the code, or ask the concierge on WhatsApp.`);
      } catch {
        setError("The line to the concierge is busy. Try again in a moment.");
      } finally {
        if (!quiet) setLoading(false);
      }
    },
    [code],
  );

  useEffect(() => {
    if (initial) void lookup(initial);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initial]);

  /* keep a live order moving */
  useEffect(() => {
    if (!order || order.status === "out") return;
    const t = window.setInterval(() => void lookup(order.code, true), 12_000);
    return () => window.clearInterval(t);
  }, [order, lookup]);

  function downloadIcs() {
    if (!booking) return;
    const blob = new Blob([icsFor(booking)], { type: "text/calendar;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `absip-${booking.code}.ics`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  async function cancelBooking() {
    if (!booking) return;
    const res = await fetch(`/api/bookings/${booking.code}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "cancelled" }),
    });
    if (res.ok) void lookup(booking.code, true);
  }

  return (
    <div className="mx-auto max-w-4xl">
      {/* search */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          void lookup();
        }}
        className="rounded-2xl border border-gold/20 bg-espresso/70 p-6 sm:p-8"
      >
        <label className="label-xs text-gold" htmlFor="code">
          Order or reservation code
        </label>
        <div className="mt-3 flex flex-col gap-3 sm:flex-row">
          <div className="flex flex-1 items-center gap-3 rounded-full border border-gold/25 bg-mocha px-5 py-3.5 transition focus-within:border-gold">
            <SearchIcon className="h-4 w-4 shrink-0 text-gold/70" />
            <input
              id="code"
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              placeholder="ABS-4K2QP or TBL-7QM2X"
              className="w-full bg-transparent font-mono text-[14px] tracking-[0.18em] text-cream uppercase placeholder:font-body placeholder:tracking-[0.1em] placeholder:text-muted/55 focus:outline-none"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="sheen flex items-center justify-center gap-3 rounded-full bg-gold px-7 py-3.5 text-[10.5px] font-semibold tracking-[0.22em] text-ink uppercase transition hover:bg-champagne disabled:opacity-60"
          >
            {loading ? "Looking…" : "Track"} <ArrowRight className="h-4 w-4" />
          </button>
        </div>
        {error ? (
          <p className="mt-4 rounded-lg border border-oxblood/40 bg-oxblood/10 px-4 py-3 text-[13px] text-cream/80">
            {error}
          </p>
        ) : null}
        <p className="mt-4 text-[11.5px] leading-relaxed text-muted">
          Codes look like{" "}
          <span className="font-mono tracking-[0.14em] text-gold/80">ABS-4K2QP</span> for orders and{" "}
          <span className="font-mono tracking-[0.14em] text-gold/80">TBL-7QM2X</span> for tables.
          They arrive by email and on screen the moment you confirm.
        </p>
      </form>

      {/* order result */}
      {order ? (
        <div className="animate-fade-up mt-8 space-y-6">
          <div className="rounded-2xl border border-gold/25 bg-espresso p-7 sm:p-9">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="label-xs text-gold">Order {order.code}</p>
                <h2 className="mt-2 font-display text-3xl text-cream">
                  {order.orderType === "delivery"
                    ? "On its way to you"
                    : order.orderType === "dine-in"
                      ? `Coming to table ${order.tableNo}`
                      : "Ready at the marble pass"}
                </h2>
                <p className="mt-2 text-[13px] text-cream/55">
                  Placed {relativeTime(order.createdAt)} · estimated {order.etaMinutes} minutes ·{" "}
                  {inr(order.total)} · {order.paymentMethod.toUpperCase()}
                </p>
              </div>
              <span className="rounded-full border border-sage/40 bg-sage/10 px-4 py-2 text-[10px] tracking-[0.2em] text-sage uppercase">
                {order.status}
              </span>
            </div>

            <ol className="mt-8">
              {ORDER_FLOW.map((f, i, arr) => {
                const idx = arr.findIndex((x) => x.key === order.status);
                const done = i <= idx;
                return (
                  <li key={f.key} className="relative flex gap-5 pb-6 last:pb-0">
                    {i < arr.length - 1 ? (
                      <span className={`absolute top-7 left-[13px] h-full w-px ${done ? "bg-gold/60" : "bg-gold/15"}`} />
                    ) : null}
                    <span
                      className={`relative z-10 mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border ${
                        done ? "border-gold bg-gold text-ink" : "border-gold/25 bg-espresso text-muted"
                      }`}
                    >
                      {done ? <CheckIcon className="h-3.5 w-3.5" /> : <span className="h-1.5 w-1.5 rounded-full bg-current" />}
                    </span>
                    <div className={i === idx ? "" : "opacity-55"}>
                      <p className="font-display text-lg text-cream">
                        {f.label}
                        {i === idx ? (
                          <span className="ml-3 text-[9.5px] tracking-[0.2em] text-sage uppercase">
                            <span className="mr-1.5 inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-sage align-middle" />
                            live
                          </span>
                        ) : null}
                      </p>
                      <p className="mt-0.5 text-[12.5px] text-cream/55">{f.note}</p>
                    </div>
                  </li>
                );
              })}
            </ol>
          </div>

          <div className="grid gap-6 md:grid-cols-[1.2fr_0.8fr]">
            <div className="rounded-2xl border border-gold/18 bg-mocha/40 p-6">
              <p className="label-xs text-gold">On this ticket</p>
              <ul className="mt-4 divide-y divide-gold/12">
                {order.items.map((l) => (
                  <li key={l.id} className="flex items-baseline justify-between gap-4 py-3">
                    <span className="text-[14px] text-cream/85">
                      <span className="mr-2 text-gold tabular-nums">{l.quantity}×</span>
                      {l.name}
                      {l.note ? <span className="ml-2 text-[11.5px] text-muted italic">— {l.note}</span> : null}
                    </span>
                    <span className="shrink-0 font-display text-[15px] text-champagne tabular-nums">
                      {inr(l.price * l.quantity)}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-6">
              <div className="rounded-2xl border border-gold/18 bg-mocha/40 p-6 text-[13px]">
                <p className="label-xs text-gold">The bill</p>
                <dl className="mt-4 space-y-2.5">
                  <Row k="Subtotal" v={inr(order.subtotal)} />
                  {order.discount ? <Row k="Promo discount" v={`− ${inr(order.discount)}`} accent /> : null}
                  {order.serviceFee ? <Row k="Service charge" v={inr(order.serviceFee)} /> : null}
                  {order.deliveryFee ? <Row k="Delivery" v={inr(order.deliveryFee)} /> : null}
                  <Row k="GST" v={inr(order.tax)} />
                  <div className="flex items-baseline justify-between border-t border-gold/15 pt-3">
                    <dt className="label-xs text-cream/80">Total</dt>
                    <dd className="font-display text-xl text-champagne tabular-nums">{inr(order.total)}</dd>
                  </div>
                </dl>
              </div>

              <div className="rounded-2xl border border-gold/18 bg-mocha/40 p-6">
                <p className="label-xs text-gold">Where &amp; when</p>
                <ul className="mt-4 space-y-2.5 text-[13px] text-cream/65">
                  <li className="flex gap-2">
                    <NoteIcon className="mt-0.5 h-4 w-4 shrink-0 text-gold/70" />
                    {order.customerName}
                  </li>
                  {order.address ? (
                    <li className="flex gap-2">
                      <ChairIcon className="mt-0.5 h-4 w-4 shrink-0 text-gold/70" />
                      {order.address}
                    </li>
                  ) : null}
                  {order.preferredTime ? (
                    <li className="flex gap-2">
                      <ClockIcon className="mt-0.5 h-4 w-4 shrink-0 text-gold/70" />
                      Collect at {order.preferredTime}
                    </li>
                  ) : null}
                  {order.notes ? (
                    <li className="flex gap-2">
                      <SparkIcon className="mt-0.5 h-4 w-4 shrink-0 text-gold/70" />
                      {order.notes}
                    </li>
                  ) : null}
                </ul>
                <a
                  href={waLink(`Hello ABsip, checking on order ${order.code} — status ${order.status}.`)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-5 flex items-center justify-center gap-2 rounded-full border border-gold/30 px-5 py-3 text-[10.5px] font-semibold tracking-[0.18em] text-cream uppercase transition hover:border-gold hover:bg-gold/10"
                >
                  <WhatsAppIcon className="h-4 w-4 text-[#25D366]" /> Ask about this order
                </a>
              </div>
            </div>
          </div>
        </div>
      ) : null}

      {/* booking result */}
      {booking ? (
        <div className="animate-fade-up mt-8 rounded-2xl border border-gold/25 bg-espresso p-7 sm:p-9">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="label-xs text-gold">Reservation {booking.code}</p>
              <h2 className="mt-2 font-display text-3xl text-cream">{booking.zone}</h2>
              <p className="mt-2 text-[13px] text-cream/55">
                Booked {relativeTime(booking.createdAt)} for {booking.guestName}
              </p>
            </div>
            <span
              className={`rounded-full border px-4 py-2 text-[10px] tracking-[0.2em] uppercase ${
                booking.status === "cancelled"
                  ? "border-oxblood/50 bg-oxblood/10 text-cream/70"
                  : "border-sage/40 bg-sage/10 text-sage"
              }`}
            >
              {booking.status}
            </span>
          </div>

          <div className="mt-7 grid gap-px overflow-hidden rounded-xl border border-gold/18 bg-gold/12 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: <CalendarIcon className="h-4 w-4" />, k: "Date", v: prettyDate(booking.date) },
              { icon: <ClockIcon className="h-4 w-4" />, k: "Seating", v: booking.slot },
              { icon: <ChairIcon className="h-4 w-4" />, k: "Party", v: `${booking.guests} guests` },
              { icon: <SparkIcon className="h-4 w-4" />, k: "Occasion", v: booking.occasion ?? "—" },
            ].map((f) => (
              <div key={f.k} className="bg-espresso px-5 py-4">
                <p className="label-xs flex items-center gap-2 text-gold/80">
                  {f.icon} {f.k}
                </p>
                <p className="mt-2 font-display text-[18px] leading-snug text-cream">{f.v}</p>
              </div>
            ))}
          </div>

          {booking.requests ? (
            <p className="mt-5 rounded-lg border border-gold/15 bg-mocha/40 px-4 py-3 text-[13px] leading-relaxed text-cream/65">
              <span className="label-xs mr-2 text-gold">Your request</span>
              {booking.requests}
            </p>
          ) : null}

          <div className="mt-7 flex flex-wrap items-center gap-3">
            <div className="flex gap-2">
              {BOOKING_FLOW.map((s) => (
                <span
                  key={s.key}
                  className={`rounded-full border px-3.5 py-1.5 text-[9.5px] tracking-[0.16em] uppercase ${
                    s.key === booking.status ? "border-gold bg-gold/15 text-champagne" : "border-gold/15 text-muted"
                  }`}
                >
                  {s.label}
                </span>
              ))}
            </div>
          </div>

          <div className="mt-7 flex flex-wrap gap-3 border-t border-gold/15 pt-6">
            <button
              type="button"
              onClick={downloadIcs}
              className="rounded-full border border-gold/35 px-6 py-3.5 text-[10.5px] font-semibold tracking-[0.2em] text-cream uppercase transition hover:border-gold hover:bg-gold/10"
            >
              Add to calendar
            </button>
            <Link
              href="/order"
              className="rounded-full bg-gold px-6 py-3.5 text-[10.5px] font-semibold tracking-[0.2em] text-ink uppercase transition hover:bg-champagne"
            >
              Pre-order for the table
            </Link>
            <a
              href={waLink(`Hello ABsip, about reservation ${booking.code} on ${prettyDate(booking.date)} at ${booking.slot}.`)}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 rounded-full border border-gold/35 px-6 py-3.5 text-[10.5px] font-semibold tracking-[0.2em] text-cream uppercase transition hover:border-gold hover:bg-gold/10"
            >
              <WhatsAppIcon className="h-4 w-4 text-[#25D366]" /> Message concierge
            </a>
            {booking.status !== "cancelled" ? (
              <button
                type="button"
                onClick={cancelBooking}
                className="ml-auto rounded-full border border-oxblood/45 px-6 py-3.5 text-[10.5px] font-semibold tracking-[0.2em] text-cream/75 uppercase transition hover:border-oxblood hover:bg-oxblood/15"
              >
                Cancel reservation
              </button>
            ) : null}
          </div>
        </div>
      ) : null}

      {/* nothing yet */}
      {!order && !booking ? (
        <div className="mt-10 grid gap-5 md:grid-cols-2">
          <Link
            href="/book"
            className="group rounded-2xl border border-gold/15 bg-mocha/40 p-7 transition hover:border-gold/45 hover:bg-mocha/70"
          >
            <ChairIcon className="h-6 w-6 text-gold" />
            <h3 className="mt-4 font-display text-2xl text-cream">No table yet?</h3>
            <p className="mt-2 text-[13.5px] leading-relaxed text-cream/55">
              Live availability across six zones, confirmed the moment you submit.
            </p>
            <span className="mt-4 inline-flex items-center gap-2 text-[11px] tracking-[0.2em] text-gold uppercase">
              Reserve now <ArrowRight className="h-4 w-4 transition-transform duration-500 group-hover:translate-x-1.5" />
            </span>
          </Link>
          <Link
            href="/order"
            className="group rounded-2xl border border-gold/15 bg-mocha/40 p-7 transition hover:border-gold/45 hover:bg-mocha/70"
          >
            <NoteIcon className="h-6 w-6 text-gold" />
            <h3 className="mt-4 font-display text-2xl text-cream">Hungry now?</h3>
            <p className="mt-2 text-[13.5px] leading-relaxed text-cream/55">
              Order to a table, the pass, or your door — you'll get a code to track it here.
            </p>
            <span className="mt-4 inline-flex items-center gap-2 text-[11px] tracking-[0.2em] text-gold uppercase">
              Start an order <ArrowRight className="h-4 w-4 transition-transform duration-500 group-hover:translate-x-1.5" />
            </span>
          </Link>
        </div>
      ) : null}

      {order?.items.length ? (
        <div className="mt-10">
          <p className="label-xs text-gold">You might add next time</p>
          <div className="mt-4 grid gap-4 sm:grid-cols-3">
            {order.items.slice(0, 3).map((l) => (
              <div key={l.id} className="rounded-xl border border-gold/12 bg-mocha/30 p-4">
                <p className="font-display text-[16px] text-cream">{l.name}</p>
                <p className="mt-1 text-[12px] text-muted tabular-nums">
                  {inr(l.price)} · ordered {l.quantity}×
                </p>
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}

function Row({ k, v, accent }: { k: string; v: string; accent?: boolean }) {
  return (
    <div className="flex items-baseline justify-between gap-3">
      <dt className={accent ? "text-sage" : "text-cream/60"}>{k}</dt>
      <dd className={`tabular-nums ${accent ? "text-sage" : "text-cream/85"}`}>{v}</dd>
    </div>
  );
}


