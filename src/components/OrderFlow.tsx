"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";

import MenuCard from "@/components/MenuCard";
import ItemModal from "@/components/ItemModal";
import Reveal from "@/components/Reveal";
import {
  ArrowRight,
  BagIcon,
  ChairIcon,
  CheckIcon,
  ClockIcon,
  MinusIcon,
  NoteIcon,
  PinIcon,
  PlusIcon,
  ScooterIcon,
  SparkIcon,
  TrayIcon,
  WhatsAppIcon,
} from "@/components/Icons";
import { useCart } from "@/components/cart/CartProvider";
import { inr } from "@/lib/money";
import { CAFE, ORDER_TYPES, PAYMENT_METHODS, PROMOS, waLink } from "@/lib/site";
import { addDaysISO, istDateKey, relativeTime } from "@/lib/time";
import type { CardItem } from "@/lib/types";

type Quote = {
  subtotal: number;
  discount: number;
  promoLabel: string | null;
  serviceFee: number;
  deliveryFee: number;
  tax: number;
  total: number;
  etaMinutes: number;
};

type Placed = {
  code: string;
  status: string;
  etaMinutes: number;
  total: number;
  createdAt: string;
  orderType: string;
};

const FLOW = [
  { key: "placed", label: "Order received", note: "The concierge has your ticket" },
  { key: "confirmed", label: "Kitchen confirmed", note: "Stock checked, fire lit" },
  { key: "preparing", label: "In preparation", note: "Your barista and chef are on it" },
  { key: "plated", label: "Plated & packed", note: "Lacquer box sealed, card written" },
  { key: "out", label: "With you", note: "Handed over — enjoy" },
];

const PICKUP_SLOTS = [
  "As soon as possible",
  "In 30 minutes",
  "In 1 hour",
  "19:00",
  "19:30",
  "20:00",
  "20:30",
  "21:00",
  "21:30",
  "22:00",
  "22:30",
  "23:00",
];

export default function OrderFlow({ suggestions }: { suggestions: CardItem[] }) {
  const { lines, setQty, remove, clear, count, subtotal, setOpen, toast } = useCart();
  const [step, setStep] = useState(1);
  const [active, setActive] = useState<CardItem | null>(null);

  const [orderType, setOrderType] = useState<string>("pickup");
  const [tableNo, setTableNo] = useState("");
  const [address, setAddress] = useState("");
  const [landmark, setLandmark] = useState("");
  const [preferredTime, setPreferredTime] = useState(PICKUP_SLOTS[0]);
  const [payment, setPayment] = useState<string>(PAYMENT_METHODS[0].id);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [notes, setNotes] = useState("");

  const [promoInput, setPromoInput] = useState("");
  const [promo, setPromo] = useState<string | null>(null);
  const [promoMsg, setPromoMsg] = useState("");
  const [quote, setQuote] = useState<Quote | null>(null);
  const [quoting, setQuoting] = useState(false);

  const [placing, setPlacing] = useState(false);
  const [error, setError] = useState("");
  const [placed, setPlaced] = useState<Placed | null>(null);
  const pollRef = useRef<number | null>(null);

  const payloadLines = lines.map((l) => ({ menuItemId: l.id, quantity: l.qty }));

  /* live server-side quote */
  const fetchQuote = useCallback(async () => {
    if (!lines.length) {
      setQuote(null);
      return;
    }
    setQuoting(true);
    try {
      const res = await fetch("/api/orders/quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderType, promo, lines: payloadLines }),
      });
      const data = (await res.json()) as { ok?: boolean; quote?: Quote; error?: string };
      if (res.ok && data.ok && data.quote) {
        setQuote(data.quote);
        if (promo && !data.quote.promoLabel) {
          setPromoMsg("That code doesn't apply to this tray.");
          setPromo(null);
        }
      }
    } catch {
      /* keep the last quote on screen */
    } finally {
      setQuoting(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lines, orderType, promo]);

  useEffect(() => {
    const t = window.setTimeout(() => void fetchQuote(), 260);
    return () => window.clearTimeout(t);
  }, [fetchQuote]);

  /* poll the placed order so the guest can watch it move */
  useEffect(() => {
    if (!placed || placed.status === "out") return;
    pollRef.current = window.setInterval(async () => {
      try {
        const res = await fetch(`/api/orders/${placed.code}`);
        const data = (await res.json()) as { ok?: boolean; order?: { status: string } };
        if (data.ok && data.order) {
          setPlaced((p) => (p ? { ...p, status: data.order!.status } : p));
        }
      } catch {
        /* ignore a missed poll */
      }
    }, 12_000);
    return () => {
      if (pollRef.current) window.clearInterval(pollRef.current);
    };
  }, [placed]);

  function applyPromo() {
    const key = promoInput.trim().toUpperCase();
    if (!key) return;
    if (PROMOS[key]) {
      setPromo(key);
      setPromoMsg(`${key} applied — ${PROMOS[key].label}.`);
      toast("Promo applied", PROMOS[key].label);
    } else {
      setPromo(null);
      setPromoMsg("We don't recognise that code.");
    }
  }

  const readyForStep3 =
    lines.length > 0 &&
    (orderType !== "delivery" || address.trim().length >= 10) &&
    (orderType !== "dine-in" || tableNo.trim().length > 0);

  async function place(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (name.trim().length < 2) return setError("Please give us a name for the order.");
    if (!/^[+\d][\d\s-]{7,17}$/.test(phone.trim())) return setError("The rider needs a reachable phone number.");
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) return setError("That email doesn't look right.");
    setPlacing(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName: name.trim(),
          phone: phone.trim(),
          email: email.trim() || undefined,
          orderType,
          address: orderType === "delivery" ? [address.trim(), landmark.trim()].filter(Boolean).join(" · ") : undefined,
          tableNo: orderType === "dine-in" ? tableNo.trim() : undefined,
          preferredTime: orderType === "pickup" ? preferredTime : undefined,
          paymentMethod: payment,
          notes: notes.trim() || undefined,
          promo,
          lines: payloadLines,
        }),
      });
      const data = (await res.json()) as {
        ok?: boolean;
        order?: Placed;
        total?: number;
        etaMinutes?: number;
        error?: string;
      };
      if (!res.ok || !data.ok || !data.order) throw new Error(data.error ?? "The kitchen couldn't take that order.");
      setPlaced({
        code: data.order.code,
        status: data.order.status,
        etaMinutes: data.order.etaMinutes ?? data.etaMinutes ?? 30,
        total: data.order.total ?? data.total ?? 0,
        createdAt: new Date().toISOString(),
        orderType,
      });
      clear();
      setPromo(null);
      setPromoInput("");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setPlacing(false);
    }
  }

  /* ─────────── confirmation ─────────── */
  if (placed) {
    const stageIndex = Math.max(0, FLOW.findIndex((f) => f.key === placed.status));
    const msg = `Hello ABsip, my order ${placed.code} (${inr(placed.total)}) is confirmed. Anything else you need from me?`;
    return (
      <div className="animate-fade-up mx-auto max-w-3xl">
        <div className="rounded-2xl border border-gold/30 bg-espresso p-8 sm:p-11">
          <div className="flex items-center gap-4">
            <span className="flex h-14 w-14 items-center justify-center rounded-full border border-sage/50 bg-sage/10 text-sage">
              <CheckIcon className="h-7 w-7" />
            </span>
            <div>
              <p className="label-xs text-gold">Order {placed.code}</p>
              <h2 className="font-display text-4xl text-cream">Thank you — it's in the book.</h2>
            </div>
          </div>

          <p className="mt-6 text-[15px] leading-relaxed text-cream/65">
            {placed.orderType === "delivery"
              ? "A concierge rider will collect it in a thermal lacquer box."
              : placed.orderType === "dine-in"
                ? "Your table will be served from the pass — no need to queue."
                : "Collect from the marble pass at the Hill Road entrance."}{" "}
            Estimated <span className="text-champagne">{placed.etaMinutes} minutes</span>, total{" "}
            <span className="text-champagne">{inr(placed.total)}</span>. This page updates itself as
            the kitchen moves your ticket.
          </p>

          <ol className="mt-9 space-y-0">
            {FLOW.map((f, i) => {
              const done = i <= stageIndex;
              const current = i === stageIndex;
              return (
                <li key={f.key} className="relative flex gap-5 pb-7 last:pb-0">
                  {i < FLOW.length - 1 ? (
                    <span
                      className={`absolute top-7 left-[13px] h-full w-px ${done ? "bg-gold/60" : "bg-gold/15"}`}
                    />
                  ) : null}
                  <span
                    className={`relative z-10 mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border transition ${
                      done ? "border-gold bg-gold text-ink" : "border-gold/25 bg-espresso text-muted"
                    }`}
                  >
                    {done ? <CheckIcon className="h-3.5 w-3.5" /> : <span className="h-1.5 w-1.5 rounded-full bg-current" />}
                  </span>
                  <div className={current ? "" : "opacity-60"}>
                    <p className="font-display text-lg text-cream">
                      {f.label}
                      {current ? (
                        <span className="ml-3 align-middle text-[9.5px] tracking-[0.2em] text-sage uppercase">
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

          <div className="mt-8 flex flex-wrap gap-3 border-t border-gold/15 pt-7">
            <a
              href={waLink(msg)}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 rounded-full bg-gold px-6 py-3.5 text-[10.5px] font-semibold tracking-[0.2em] text-ink uppercase transition hover:bg-champagne"
            >
              <WhatsAppIcon className="h-4 w-4" /> Message the concierge
            </a>
            <Link
              href={`/track?code=${placed.code}`}
              className="rounded-full border border-gold/35 px-6 py-3.5 text-[10.5px] font-semibold tracking-[0.2em] text-cream uppercase transition hover:border-gold hover:bg-gold/10"
            >
              Full tracking page
            </Link>
            <Link
              href="/book"
              className="rounded-full border border-gold/35 px-6 py-3.5 text-[10.5px] font-semibold tracking-[0.2em] text-cream uppercase transition hover:border-gold hover:bg-gold/10"
            >
              Reserve a table too
            </Link>
          </div>

          <button
            type="button"
            onClick={() => {
              setPlaced(null);
              setStep(1);
            }}
            className="mt-7 text-[11px] tracking-[0.2em] text-muted uppercase transition hover:text-champagne"
          >
            ← Start another order
          </button>
        </div>

        <div className="mt-10">
          <p className="label-xs text-gold">Order again</p>
          <div className="mt-5 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {suggestions.slice(0, 3).map((s) => (
              <MenuCard key={s.id} item={s} onOpen={setActive} />
            ))}
          </div>
        </div>
        <ItemModal item={active} onClose={() => setActive(null)} />
      </div>
    );
  }

  /* ─────────── empty tray ─────────── */
  if (lines.length === 0) {
    return (
      <div>
        <Reveal>
          <div className="rounded-2xl border border-gold/18 bg-espresso/70 px-7 py-14 text-center sm:px-12">
            <TrayIcon className="mx-auto h-14 w-14 text-gold/35" />
            <h2 className="mt-6 font-display text-[clamp(1.8rem,4vw,2.8rem)] text-cream">
              Your tray is empty
            </h2>
            <p className="mx-auto mt-3 max-w-md text-[14.5px] leading-relaxed text-cream/55">
              Add something from the menu and it will appear here. Nothing is charged until you place
              the order, and the kitchen confirms every ticket by hand.
            </p>
            <div className="mt-7 flex flex-wrap justify-center gap-3">
              <Link
                href="/menu"
                className="sheen flex items-center gap-3 rounded-full bg-gold px-7 py-4 text-[10.5px] font-semibold tracking-[0.22em] text-ink uppercase transition hover:bg-champagne"
              >
                <BagIcon className="h-4 w-4" /> Browse the menu <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/book"
                className="rounded-full border border-gold/35 px-7 py-4 text-[10.5px] font-semibold tracking-[0.22em] text-cream uppercase transition hover:border-gold hover:bg-gold/10"
              >
                Reserve a table first
              </Link>
            </div>
          </div>
        </Reveal>

        <div className="mt-14">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <h3 className="font-display text-3xl text-cream">
              Most ordered <span className="text-gilt italic">tonight</span>
            </h3>
            <Link href="/menu" className="label-xs text-gold transition hover:text-champagne">
              See all {suggestions.length * 4}+ items →
            </Link>
          </div>
          <div className="mt-7 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {suggestions.slice(0, 6).map((s, i) => (
              <Reveal key={s.id} delay={i * 60}>
                <MenuCard item={s} onOpen={setActive} />
              </Reveal>
            ))}
          </div>
        </div>
        <ItemModal item={active} onClose={() => setActive(null)} />
      </div>
    );
  }

  /* ─────────── checkout ─────────── */
  return (
    <form onSubmit={place} className="grid gap-8 lg:grid-cols-[1.3fr_0.7fr]">
      <div className="rounded-2xl border border-gold/15 bg-espresso/70 p-6 sm:p-9">
        <ol className="mb-9 flex items-center gap-3">
          {[
            { n: 1, label: "Tray" },
            { n: 2, label: "Service" },
            { n: 3, label: "Pay & place" },
          ].map((s, i) => (
            <li key={s.n} className="flex flex-1 items-center gap-3">
              <button
                type="button"
                onClick={() => setStep(s.n)}
                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border text-[12px] tabular-nums transition ${
                  step === s.n
                    ? "border-gold bg-gold text-ink"
                    : step > s.n
                      ? "border-sage/50 bg-sage/10 text-sage"
                      : "border-gold/25 text-muted hover:border-gold/60"
                }`}
              >
                {step > s.n ? <CheckIcon className="h-4 w-4" /> : s.n}
              </button>
              <span className={`label-xs ${step === s.n ? "text-champagne" : "text-muted"}`}>{s.label}</span>
              {i < 2 ? <span className="h-px flex-1 bg-gold/20" /> : null}
            </li>
          ))}
        </ol>

        {step === 1 ? (
          <div className="animate-fade-up space-y-6">
            <h2 className="font-display text-2xl text-cream">
              {count} {count === 1 ? "item" : "items"} on the tray
            </h2>
            <ul className="divide-y divide-gold/12">
              {lines.map((l) => (
                <li key={l.id} className="flex gap-4 py-5">
                  <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg ring-1 ring-gold/20">
                    <Image src={l.image} alt={l.name} fill sizes="80px" className="object-cover" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-display text-[17px] leading-snug text-cream">{l.name}</p>
                    <p className="label-xs mt-1 text-muted">{l.category}</p>
                    <div className="mt-3 flex flex-wrap items-center gap-3">
                      <div className="flex items-center gap-3 rounded-full border border-gold/25 px-2.5 py-1.5">
                        <button type="button" aria-label={`Reduce ${l.name}`} onClick={() => setQty(l.id, l.qty - 1)} className="text-cream/70 hover:text-champagne">
                          <MinusIcon className="h-3.5 w-3.5" />
                        </button>
                        <span className="w-5 text-center text-sm tabular-nums">{l.qty}</span>
                        <button type="button" aria-label={`Add another ${l.name}`} onClick={() => setQty(l.id, l.qty + 1)} className="text-cream/70 hover:text-champagne">
                          <PlusIcon className="h-3.5 w-3.5" />
                        </button>
                      </div>
                      <button
                        type="button"
                        onClick={() => remove(l.id)}
                        className="text-[10.5px] tracking-[0.16em] text-muted uppercase transition hover:text-oxblood"
                      >
                        Remove
                      </button>
                      <span className="ml-auto font-display text-lg text-champagne tabular-nums">
                        {inr(l.price * l.qty)}
                      </span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            <div>
              <p className="label-xs text-gold">The kitchen also suggests</p>
              <div className="mt-4 flex gap-3 overflow-x-auto pb-3 [scrollbar-width:thin]">
                {suggestions
                  .filter((s) => !lines.some((l) => l.id === s.id))
                  .slice(0, 5)
                  .map((s) => (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => setActive(s)}
                      className="group flex w-[230px] shrink-0 items-center gap-3 rounded-xl border border-gold/15 bg-mocha/40 p-2.5 text-left transition hover:border-gold/45 hover:bg-mocha"
                    >
                      <span className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg">
                        <Image src={s.image} alt={s.name} fill sizes="56px" className="object-cover transition duration-700 group-hover:scale-110" />
                      </span>
                      <span className="min-w-0">
                        <span className="block truncate font-display text-[14.5px] text-cream">{s.name}</span>
                        <span className="mt-0.5 block text-[12px] text-champagne tabular-nums">{inr(s.price)}</span>
                      </span>
                    </button>
                  ))}
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="sheen flex items-center gap-3 rounded-full bg-gold px-7 py-4 text-[10.5px] font-semibold tracking-[0.22em] text-ink uppercase transition hover:bg-champagne"
              >
                How would you like it? <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        ) : null}

        {step === 2 ? (
          <div className="animate-fade-up space-y-7">
            <h2 className="font-display text-2xl text-cream">Service style</h2>
            <div className="grid gap-3 sm:grid-cols-3">
              {ORDER_TYPES.map((t) => {
                const on = orderType === t.id;
                const icon =
                  t.id === "dine-in" ? <ChairIcon className="h-5 w-5" /> : t.id === "pickup" ? <TrayIcon className="h-5 w-5" /> : <ScooterIcon className="h-5 w-5" />;
                return (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setOrderType(t.id)}
                    className={`rounded-xl border p-5 text-left transition-all duration-300 ${
                      on ? "border-gold bg-gold/10" : "border-gold/15 bg-mocha/40 hover:border-gold/45 hover:bg-mocha/70"
                    }`}
                  >
                    <span className={on ? "text-gold" : "text-gold/60"}>{icon}</span>
                    <p className="mt-3 font-display text-[19px] leading-tight text-cream">{t.name}</p>
                    <p className="mt-2 text-[12.5px] leading-relaxed text-cream/55">{t.detail}</p>
                    <p className="label-xs mt-3 text-gold/75">{t.eta}</p>
                  </button>
                );
              })}
            </div>

            {orderType === "dine-in" ? (
              <div className="rounded-xl border border-gold/15 bg-mocha/40 p-5">
                <label className="label-xs text-gold" htmlFor="table">
                  Table number
                </label>
                <input
                  id="table"
                  value={tableNo}
                  onChange={(e) => setTableNo(e.target.value)}
                  placeholder="e.g. 12 or Terrace 4"
                  className="mt-2.5 w-full rounded-lg border border-gold/20 bg-espresso px-4 py-3 text-[14px] text-cream placeholder:text-muted/55 focus:border-gold focus:outline-none"
                />
                <p className="mt-3 flex items-start gap-2 text-[12.5px] leading-relaxed text-cream/50">
                  <SparkIcon className="mt-0.5 h-3.5 w-3.5 shrink-0 text-gold/70" />
                  No table yet?{" "}
                  <Link href="/book" className="text-gold underline decoration-gold/40 underline-offset-4">
                    Reserve one in a minute
                  </Link>{" "}
                  — a 5% service charge applies to in-house orders.
                </p>
              </div>
            ) : null}

            {orderType === "delivery" ? (
              <div className="grid gap-5 rounded-xl border border-gold/15 bg-mocha/40 p-5 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label className="label-xs text-gold" htmlFor="addr">
                    Delivery address
                  </label>
                  <textarea
                    id="addr"
                    rows={3}
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Flat, building, street — within 6 km of Pali Naka"
                    className="mt-2.5 w-full resize-none rounded-lg border border-gold/20 bg-espresso px-4 py-3 text-[14px] leading-relaxed text-cream placeholder:text-muted/55 focus:border-gold focus:outline-none"
                  />
                </div>
                <div>
                  <label className="label-xs text-gold" htmlFor="landmark">
                    Landmark (optional)
                  </label>
                  <input
                    id="landmark"
                    value={landmark}
                    onChange={(e) => setLandmark(e.target.value)}
                    placeholder="Opposite the hill road bakery"
                    className="mt-2.5 w-full rounded-lg border border-gold/20 bg-espresso px-4 py-3 text-[14px] text-cream placeholder:text-muted/55 focus:border-gold focus:outline-none"
                  />
                </div>
                <div className="flex items-end">
                  <p className="flex items-start gap-2 text-[12.5px] leading-relaxed text-cream/50">
                    <PinIcon className="mt-0.5 h-3.5 w-3.5 shrink-0 text-gold/70" />
                    {quote && quote.subtotal - quote.discount >= 2500
                      ? "Complimentary delivery unlocked on this tray."
                      : `Delivery is ${inr(149)} — free above ${inr(2500)}.`}
                  </p>
                </div>
              </div>
            ) : null}

            {orderType === "pickup" ? (
              <div className="rounded-xl border border-gold/15 bg-mocha/40 p-5">
                <label className="label-xs text-gold" htmlFor="slot">
                  Collect at
                </label>
                <div id="slot" className="mt-3 flex flex-wrap gap-2">
                  {PICKUP_SLOTS.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setPreferredTime(s)}
                      className={`rounded-full border px-4 py-2 text-[11px] tracking-[0.12em] transition ${
                        preferredTime === s
                          ? "border-gold bg-gold text-ink"
                          : "border-gold/20 text-cream/70 hover:border-gold/55 hover:text-cream"
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            ) : null}

            <div className="flex justify-between">
              <button type="button" onClick={() => setStep(1)} className="label-xs rounded-full border border-gold/25 px-6 py-3.5 text-cream/70 transition hover:border-gold hover:text-cream">
                ← Back to tray
              </button>
              <button
                type="button"
                disabled={!readyForStep3}
                onClick={() => setStep(3)}
                className="sheen flex items-center gap-3 rounded-full bg-gold px-7 py-4 text-[10.5px] font-semibold tracking-[0.22em] text-ink uppercase transition hover:bg-champagne disabled:cursor-not-allowed disabled:opacity-40"
              >
                {readyForStep3 ? "Continue" : "Add the missing detail"} <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        ) : null}

        {step === 3 ? (
          <div className="animate-fade-up space-y-7">
            <h2 className="font-display text-2xl text-cream">Who's it for?</h2>
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Full name" value={name} onChange={setName} placeholder="Aarav Shah" autoComplete="name" />
              <Field label="Phone" value={phone} onChange={setPhone} placeholder="+91 98200 00000" type="tel" autoComplete="tel" />
              <Field label="Email (optional)" value={email} onChange={setEmail} placeholder="you@email.com" type="email" autoComplete="email" className="sm:col-span-2" />
            </div>

            <div>
              <p className="label-xs text-gold">Payment</p>
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                {PAYMENT_METHODS.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setPayment(p.id)}
                    className={`rounded-xl border p-4 text-left transition ${
                      payment === p.id ? "border-gold bg-gold/10" : "border-gold/15 bg-mocha/40 hover:border-gold/45"
                    }`}
                  >
                    <p className="font-display text-[17px] text-cream">{p.name}</p>
                    <p className="mt-1 text-[12px] text-cream/50">{p.detail}</p>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="label-xs text-gold" htmlFor="notes">
                Notes for the kitchen
              </label>
              <textarea
                id="notes"
                rows={3}
                maxLength={400}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="No onion in the masala, extra hot, ring the bell twice…"
                className="mt-2.5 w-full resize-none rounded-lg border border-gold/20 bg-mocha px-4 py-3.5 text-[14px] leading-relaxed text-cream placeholder:text-muted/55 focus:border-gold focus:outline-none"
              />
              <p className="mt-1.5 text-right text-[11px] text-muted tabular-nums">{notes.length}/400</p>
            </div>

            {error ? (
              <p className="rounded-lg border border-oxblood/45 bg-oxblood/10 px-4 py-3 text-[13px] text-cream/80">{error}</p>
            ) : null}

            <div className="flex flex-wrap justify-between gap-3">
              <button type="button" onClick={() => setStep(2)} className="label-xs rounded-full border border-gold/25 px-6 py-3.5 text-cream/70 transition hover:border-gold hover:text-cream">
                ← Back to service
              </button>
              <button
                type="submit"
                disabled={placing}
                className="sheen flex items-center gap-3 rounded-full bg-gold px-8 py-4 text-[10.5px] font-semibold tracking-[0.22em] text-ink uppercase transition hover:bg-champagne disabled:opacity-60"
              >
                {placing ? "Sending to the pass…" : `Place order · ${inr(quote?.total ?? subtotal)}`}
                <ArrowRight className={`h-4 w-4 ${placing ? "animate-pulse" : ""}`} />
              </button>
            </div>
          </div>
        ) : null}
      </div>

      {/* live bill */}
      <aside className="lg:sticky lg:top-28 lg:self-start">
        <div className="overflow-hidden rounded-2xl border border-gold/20 bg-mocha/50">
          <p className="label-xs flex items-center justify-between border-b border-gold/15 bg-espresso px-6 py-4 text-gold">
            <span>The bill</span>
            {quoting ? <span className="text-muted normal-case">pricing…</span> : null}
          </p>
          <div className="space-y-3 px-6 py-5 text-[13px]">
            <Line k={`Subtotal · ${count} items`} v={inr(quote?.subtotal ?? subtotal)} />
            {quote && quote.discount > 0 ? (
              <Line k={`Promo ${promo}`} v={`− ${inr(quote.discount)}`} accent />
            ) : null}
            {quote && quote.serviceFee > 0 ? <Line k="Service charge (5%)" v={inr(quote.serviceFee)} /> : null}
            {quote && quote.deliveryFee > 0 ? <Line k="Concierge delivery" v={inr(quote.deliveryFee)} /> : null}
            {quote && quote.deliveryFee === 0 && orderType === "delivery" ? (
              <Line k="Concierge delivery" v="Complimentary" accent />
            ) : null}
            <Line k="GST (5%)" v={inr(quote?.tax ?? Math.round(subtotal * 0.05))} />
            <div className="flex items-baseline justify-between border-t border-gold/15 pt-3">
              <span className="label-xs text-cream/80">Total</span>
              <span className="font-display text-2xl text-champagne tabular-nums">
                {inr(quote?.total ?? subtotal)}
              </span>
            </div>
            <p className="flex items-center gap-2 pt-1 text-[12px] text-cream/55">
              <ClockIcon className="h-3.5 w-3.5 text-gold/70" />
              Ready in about {quote?.etaMinutes ?? 30} minutes
            </p>
          </div>

          <div className="border-t border-gold/15 px-6 py-5">
            <label className="label-xs text-gold" htmlFor="promo">
              Have a code?
            </label>
            <div className="mt-2.5 flex gap-2">
              <input
                id="promo"
                value={promoInput}
                onChange={(e) => setPromoInput(e.target.value.toUpperCase())}
                placeholder="ABSIP10"
                className="w-full rounded-lg border border-gold/20 bg-espresso px-3.5 py-2.5 text-[13px] tracking-[0.12em] text-cream uppercase placeholder:text-muted/50 focus:border-gold focus:outline-none"
              />
              <button
                type="button"
                onClick={applyPromo}
                className="shrink-0 rounded-lg border border-gold/30 px-4 text-[10px] font-semibold tracking-[0.16em] text-cream uppercase transition hover:border-gold hover:bg-gold hover:text-ink"
              >
                Apply
              </button>
            </div>
            {promoMsg ? <p className="mt-2 text-[11.5px] text-gold/85">{promoMsg}</p> : null}
            <div className="mt-3 flex flex-wrap gap-1.5">
              {Object.entries(PROMOS).map(([code, p]) => (
                <button
                  key={code}
                  type="button"
                  onClick={() => {
                    setPromoInput(code);
                    setPromo(code);
                    setPromoMsg(`${code} applied — ${p.label}.`);
                  }}
                  title={p.note}
                  className="rounded-full border border-gold/20 px-2.5 py-1 text-[9.5px] tracking-[0.14em] text-cream/55 uppercase transition hover:border-gold/60 hover:text-champagne"
                >
                  {code}
                </button>
              ))}
            </div>
          </div>

          <div className="border-t border-gold/15 px-6 py-5">
            <button
              type="button"
              onClick={() => setOpen(true)}
              className="flex w-full items-center justify-center gap-2 rounded-full border border-gold/30 px-5 py-3 text-[10.5px] font-semibold tracking-[0.18em] text-cream uppercase transition hover:border-gold hover:bg-gold/10"
            >
              <NoteIcon className="h-4 w-4 text-gold" /> Review the tray
            </button>
            <p className="mt-4 text-[11.5px] leading-relaxed text-muted">
              Ordering for {istDateKey()}; tomorrow's trays open from {addDaysISO(1)}. The concierge
              confirms every ticket by hand within two minutes — call {CAFE.phoneDisplay} if you are
              in a hurry.
            </p>
          </div>
        </div>

        {placed ? null : (
          <div className="mt-5 rounded-2xl border border-gold/15 bg-espresso/70 p-6">
            <p className="label-xs flex items-center gap-2 text-gold">
              <SparkIcon className="h-3.5 w-3.5" /> Last order {relativeTime(new Date().toISOString())}
            </p>
            <p className="mt-3 text-[13px] leading-relaxed text-cream/55">
              Everything is packed in thermal lacquer boxes with the lot card tucked inside. Beans
              travel in 250 g tins, ground to your method if you ask.
            </p>
          </div>
        )}
      </aside>
    </form>
  );
}

function Line({ k, v, accent }: { k: string; v: string; accent?: boolean }) {
  return (
    <div className="flex items-baseline justify-between gap-3">
      <span className={accent ? "text-sage" : "text-cream/60"}>{k}</span>
      <span className={`tabular-nums ${accent ? "text-sage" : "text-cream/85"}`}>{v}</span>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  autoComplete,
  className = "",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
  autoComplete?: string;
  className?: string;
}) {
  return (
    <div className={className}>
      <label className="label-xs text-gold" htmlFor={`o-${label}`}>
        {label}
      </label>
      <input
        id={`o-${label}`}
        type={type}
        value={value}
        autoComplete={autoComplete}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="mt-2.5 w-full rounded-lg border border-gold/20 bg-mocha px-4 py-3.5 text-[14px] text-cream placeholder:text-muted/55 focus:border-gold focus:outline-none"
      />
    </div>
  );
}
