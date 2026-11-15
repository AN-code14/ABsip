"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";

import {
  ArrowRight,
  CalendarIcon,
  ChairIcon,
  CheckIcon,
  ClockIcon,
  NoteIcon,
  SparkIcon,
  WhatsAppIcon,
} from "@/components/Icons";
import { OCCASIONS, ZONES, waLink } from "@/lib/site";
import { SLOT_GROUPS } from "@/lib/site";
import { addDaysISO, dayNumber, icsFor, istDateKey, prettyDate, shortDate, weekdayShort } from "@/lib/time";
import { CAFE } from "@/lib/site";

type SlotState = "open" | "limited" | "full" | "passed";
type Slot = { slot: string; booked: number; seats: number; state: SlotState };
type Confirmed = {
  code: string;
  guestName: string;
  date: string;
  slot: string;
  guests: number;
  zone: string;
};

/** Max party size per zone, mirrored from the floor plan. */
const ZONE_LIMITS: Record<string, [number, number]> = {
  "The Window Gallery": [1, 4],
  "The Library": [2, 6],
  "Terrace Noir": [2, 10],
  "The Chef's Counter": [1, 4],
  "The Private Salon": [6, 18],
  "The Roastery Loft": [2, 8],
};

const DAYS = Array.from({ length: 21 }, (_, i) => addDaysISO(i));

export default function BookingForm() {
  const today = useMemo(() => istDateKey(), []);
  const [step, setStep] = useState(1);
  const [date, setDate] = useState(today);
  const [guests, setGuests] = useState(2);
  const [zone, setZone] = useState<string>(ZONES[0].name);
  const [slot, setSlot] = useState<string>("");
  const [occasion, setOccasion] = useState<string>(OCCASIONS[0]);
  const [requests, setRequests] = useState("");

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");

  const [slots, setSlots] = useState<Slot[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadError, setLoadError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [confirmed, setConfirmed] = useState<Confirmed | null>(null);

  const loadSlots = useCallback(async () => {
    setLoading(true);
    setLoadError("");
    try {
      const res = await fetch(`/api/availability?date=${date}&guests=${guests}`);
      const data = (await res.json()) as { ok?: boolean; slots?: Slot[]; error?: string };
      if (!res.ok || !data.ok) throw new Error(data.error ?? "Availability could not be loaded.");
      setSlots(data.slots ?? []);
      setSlot((prev) => {
        const still = (data.slots ?? []).find((s) => s.slot === prev && s.state !== "full" && s.state !== "passed");
        return still ? prev : "";
      });
    } catch (err) {
      setLoadError(err instanceof Error ? err.message : "Availability could not be loaded.");
      setSlots([]);
    } finally {
      setLoading(false);
    }
  }, [date, guests]);

  useEffect(() => {
    void loadSlots();
  }, [loadSlots]);

  const allowedZones = useMemo(
    () =>
      ZONES.map((z) => {
        const [min, max] = ZONE_LIMITS[z.name] ?? [1, 20];
        return { ...z, min, max, fits: guests >= min && guests <= max };
      }),
    [guests],
  );

  useEffect(() => {
    const current = allowedZones.find((z) => z.name === zone);
    if (!current?.fits) {
      const fallback = allowedZones.find((z) => z.fits);
      if (fallback) setZone(fallback.name);
    }
  }, [allowedZones, zone]);

  const openCount = slots.filter((s) => s.state === "open" || s.state === "limited").length;

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!slot) {
      setError("Choose a seating time to continue.");
      setStep(2);
      return;
    }
    if (name.trim().length < 2 || !/^[+\d][\d\s-]{7,17}$/.test(phone) || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please complete your name, a reachable phone number and a valid email.");
      setStep(3);
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ guestName: name.trim(), phone: phone.trim(), email: email.trim(), date, slot, guests, zone, occasion, requests }),
      });
      const data = (await res.json()) as { ok?: boolean; booking?: Confirmed; error?: string };
      if (!res.ok || !data.ok || !data.booking) throw new Error(data.error ?? "The concierge could not take that table.");
      setConfirmed({
        code: data.booking.code,
        guestName: data.booking.guestName,
        date: data.booking.date,
        slot: data.booking.slot,
        guests: data.booking.guests,
        zone: data.booking.zone,
      });
      void loadSlots();
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  }

  function downloadIcs() {
    if (!confirmed) return;
    const blob = new Blob([icsFor(confirmed)], { type: "text/calendar;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `absip-${confirmed.code}.ics`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  /* ── confirmation ─────────────────────────────────────────── */
  if (confirmed) {
    const msg = `Hello ABsip, I've just reserved table ${confirmed.code} — ${confirmed.zone}, ${confirmed.guests} guests on ${prettyDate(confirmed.date)} at ${confirmed.slot}. Please confirm.`;
    return (
      <div className="animate-fade-up mx-auto max-w-3xl rounded-2xl border border-gold/30 bg-espresso p-8 sm:p-12">
        <div className="flex items-center gap-4">
          <span className="flex h-14 w-14 items-center justify-center rounded-full border border-sage/50 bg-sage/10 text-sage">
            <CheckIcon className="h-7 w-7" />
          </span>
          <div>
            <p className="label-xs text-gold">Table held</p>
            <h2 className="font-display text-4xl text-cream">Confirmed, {confirmed.guestName.split(" ")[0]}.</h2>
          </div>
        </div>

        <p className="mt-6 text-[15px] leading-relaxed text-cream/65">
          A confirmation is on its way to your email. The table is held for twenty minutes past the
          seating time; after that we release it to the room. Quote your code at the marble pass.
        </p>

        <div className="mt-8 grid gap-px overflow-hidden rounded-xl border border-gold/20 bg-gold/15 sm:grid-cols-2">
          {[
            { k: "Reservation code", v: confirmed.code, icon: <NoteIcon className="h-4 w-4" /> },
            { k: "Date", v: prettyDate(confirmed.date), icon: <CalendarIcon className="h-4 w-4" /> },
            { k: "Seating", v: confirmed.slot, icon: <ClockIcon className="h-4 w-4" /> },
            { k: "Party", v: `${confirmed.guests} guests`, icon: <ChairIcon className="h-4 w-4" /> },
            { k: "Zone", v: confirmed.zone, icon: <SparkIcon className="h-4 w-4" /> },
            { k: "Address", v: `${CAFE.addressLine1}, ${CAFE.addressLine2}`, icon: <ArrowRight className="h-4 w-4" /> },
          ].map((r) => (
            <div key={r.k} className="bg-espresso px-5 py-4">
              <p className="label-xs flex items-center gap-2 text-gold/80">
                {r.icon} {r.k}
              </p>
              <p className="mt-2 font-display text-[19px] leading-snug text-cream">{r.v}</p>
            </div>
          ))}
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={downloadIcs}
            className="rounded-full border border-gold/35 px-6 py-3.5 text-[10.5px] font-semibold tracking-[0.2em] text-cream uppercase transition hover:border-gold hover:bg-gold/10"
          >
            Add to calendar
          </button>
          <a
            href={waLink(msg)}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 rounded-full bg-gold px-6 py-3.5 text-[10.5px] font-semibold tracking-[0.2em] text-ink uppercase transition hover:bg-champagne"
          >
            <WhatsAppIcon className="h-4 w-4" /> Confirm on WhatsApp
          </a>
          <Link
            href="/order"
            className="rounded-full border border-gold/35 px-6 py-3.5 text-[10.5px] font-semibold tracking-[0.2em] text-cream uppercase transition hover:border-gold hover:bg-gold/10"
          >
            Pre-order for the table
          </Link>
          <Link
            href={`/track?code=${confirmed.code}`}
            className="rounded-full border border-gold/35 px-6 py-3.5 text-[10.5px] font-semibold tracking-[0.2em] text-cream uppercase transition hover:border-gold hover:bg-gold/10"
          >
            Track reservation
          </Link>
        </div>

        <button
          type="button"
          onClick={() => {
            setConfirmed(null);
            setStep(1);
            setSlot("");
            setRequests("");
          }}
          className="mt-8 text-[11px] tracking-[0.2em] text-muted uppercase transition hover:text-champagne"
        >
          ← Book another table
        </button>
      </div>
    );
  }

  /* ── wizard ───────────────────────────────────────────────── */
  return (
    <form onSubmit={submit} className="grid gap-8 lg:grid-cols-[1.35fr_0.65fr]">
      <div className="rounded-2xl border border-gold/15 bg-espresso/70 p-6 sm:p-9">
        {/* step rail */}
        <ol className="mb-9 flex items-center gap-3">
          {[
            { n: 1, label: "Table" },
            { n: 2, label: "Seating" },
            { n: 3, label: "Details" },
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
                aria-current={step === s.n}
              >
                {step > s.n ? <CheckIcon className="h-4 w-4" /> : s.n}
              </button>
              <span className={`label-xs ${step === s.n ? "text-champagne" : "text-muted"}`}>{s.label}</span>
              {i < 2 ? <span className="h-px flex-1 bg-gold/20" /> : null}
            </li>
          ))}
        </ol>

        {/* STEP 1 */}
        {step === 1 ? (
          <div className="animate-fade-up space-y-9">
            <div>
              <h2 className="flex items-center gap-3 font-display text-2xl text-cream">
                <CalendarIcon className="h-5 w-5 text-gold" /> Which evening?
              </h2>
              <p className="mt-2 text-[13.5px] text-cream/55">
                Sixty days of the calendar are open. Weekend terraces fill by Thursday.
              </p>
              <div className="mt-5 flex gap-2.5 overflow-x-auto pb-3 [scrollbar-width:thin]">
                {DAYS.map((d) => {
                  const on = d === date;
                  return (
                    <button
                      key={d}
                      type="button"
                      onClick={() => setDate(d)}
                      className={`flex w-[68px] shrink-0 flex-col items-center gap-0.5 rounded-xl border px-2 py-3 transition-all duration-300 ${
                        on
                          ? "border-gold bg-gold text-ink"
                          : "border-gold/18 text-cream/70 hover:border-gold/50 hover:bg-mocha"
                      }`}
                    >
                      <span className="text-[9.5px] tracking-[0.16em] uppercase opacity-75">{weekdayShort(d)}</span>
                      <span className="font-display text-2xl leading-none tabular-nums">{dayNumber(d)}</span>
                      <span className="text-[9px] tracking-[0.12em] uppercase opacity-60">
                        {d === today ? "Today" : shortDate(d).split(" ").slice(-1)}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <h2 className="flex items-center gap-3 font-display text-2xl text-cream">
                <ChairIcon className="h-5 w-5 text-gold" /> How many at the table?
              </h2>
              <div className="mt-5 flex flex-wrap items-center gap-3">
                {[1, 2, 3, 4, 5, 6, 8, 10, 12].map((g) => (
                  <button
                    key={g}
                    type="button"
                    onClick={() => setGuests(g)}
                    className={`h-11 w-11 rounded-full border text-[13px] tabular-nums transition ${
                      guests === g
                        ? "border-gold bg-gold text-ink"
                        : "border-gold/20 text-cream/70 hover:border-gold/60 hover:text-cream"
                    }`}
                  >
                    {g}
                  </button>
                ))}
                <div className="ml-2 flex items-center gap-3 rounded-full border border-gold/20 px-3 py-2">
                  <button type="button" aria-label="Fewer guests" onClick={() => setGuests((g) => Math.max(1, g - 1))} className="text-xl leading-none text-cream/70 hover:text-champagne">
                    −
                  </button>
                  <span className="w-6 text-center tabular-nums">{guests}</span>
                  <button type="button" aria-label="More guests" onClick={() => setGuests((g) => Math.min(20, g + 1))} className="text-xl leading-none text-cream/70 hover:text-champagne">
                    +
                  </button>
                </div>
              </div>
              {guests > 12 ? (
                <p className="mt-3 text-[12.5px] text-gold/80">
                  Parties above twelve are handled by the Private Salon — the concierge will call to
                  confirm the room fee and menu.
                </p>
              ) : null}
            </div>

            <div>
              <h2 className="flex items-center gap-3 font-display text-2xl text-cream">
                <SparkIcon className="h-5 w-5 text-gold" /> Choose your room
              </h2>
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                {allowedZones.map((z) => (
                  <button
                    key={z.id}
                    type="button"
                    disabled={!z.fits}
                    onClick={() => setZone(z.name)}
                    className={`group relative overflow-hidden rounded-xl border p-5 text-left transition-all duration-400 ${
                      zone === z.name
                        ? "border-gold bg-gold/10"
                        : z.fits
                          ? "border-gold/15 bg-mocha/40 hover:border-gold/45 hover:bg-mocha/70"
                          : "cursor-not-allowed border-gold/8 bg-mocha/20 opacity-45"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <p className="font-display text-[19px] leading-tight text-cream">{z.name}</p>
                      {zone === z.name ? <CheckIcon className="h-4 w-4 shrink-0 text-gold" /> : null}
                    </div>
                    <p className="label-xs mt-2 text-gold/75">{z.seats}</p>
                    <p className="mt-2.5 text-[12.5px] leading-relaxed text-cream/55">{z.blurb}</p>
                    <p className="mt-3 text-[10.5px] tracking-[0.14em] text-muted uppercase">{z.tone}</p>
                    {!z.fits ? (
                      <p className="mt-2 text-[10.5px] tracking-[0.14em] text-oxblood uppercase">
                        Not sized for {guests}
                      </p>
                    ) : null}
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
                Choose a seating <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        ) : null}

        {/* STEP 2 */}
        {step === 2 ? (
          <div className="animate-fade-up space-y-8">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <h2 className="flex items-center gap-3 font-display text-2xl text-cream">
                  <ClockIcon className="h-5 w-5 text-gold" /> {prettyDate(date)}
                </h2>
                <p className="mt-2 text-[13.5px] text-cream/55">
                  {loading
                    ? "Checking the floor plan…"
                    : loadError
                      ? loadError
                      : `${openCount} seatings available for ${guests} ${guests === 1 ? "guest" : "guests"} in the ${zone}.`}
                </p>
              </div>
              <button
                type="button"
                onClick={() => void loadSlots()}
                className="label-xs rounded-full border border-gold/25 px-4 py-2 text-cream/70 transition hover:border-gold hover:text-champagne"
              >
                Refresh
              </button>
            </div>

            {loading ? (
              <div className="grid gap-3 sm:grid-cols-3">
                {Array.from({ length: 12 }).map((_, i) => (
                  <div key={i} className="h-16 animate-pulse rounded-lg border border-gold/10 bg-mocha/40" />
                ))}
              </div>
            ) : (
              <div className="space-y-7">
                {SLOT_GROUPS.map((group) => {
                  const groupSlots = group.slots
                    .map((s) => slots.find((x) => x.slot === s))
                    .filter((x): x is Slot => Boolean(x));
                  if (!groupSlots.length) return null;
                  return (
                    <div key={group.label}>
                      <p className="label-xs flex items-center gap-3 text-gold">
                        {group.label}
                        <span className="h-px flex-1 bg-gold/15" />
                      </p>
                      <div className="mt-4 grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-6">
                        {groupSlots.map((s) => {
                          const disabled = s.state === "full" || s.state === "passed";
                          const on = slot === s.slot;
                          return (
                            <button
                              key={s.slot}
                              type="button"
                              disabled={disabled}
                              onClick={() => setSlot(s.slot)}
                              className={`relative rounded-lg border px-3 py-3 text-left transition-all duration-300 ${
                                on
                                  ? "border-gold bg-gold text-ink"
                                  : disabled
                                    ? "cursor-not-allowed border-gold/8 bg-mocha/20 text-muted/50 line-through"
                                    : s.state === "limited"
                                      ? "border-oxblood/45 bg-oxblood/10 text-cream hover:border-oxblood"
                                      : "border-gold/18 text-cream/80 hover:border-gold/60 hover:bg-mocha"
                              }`}
                            >
                              <span className="block font-display text-[17px] tabular-nums">{s.slot}</span>
                              <span
                                className={`mt-0.5 block text-[9.5px] tracking-[0.14em] uppercase ${
                                  on ? "text-ink/65" : "text-muted"
                                }`}
                              >
                                {s.state === "passed"
                                  ? "Closed"
                                  : s.state === "full"
                                    ? "Fully seated"
                                    : `${s.seats} seats`}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {loadError ? (
              <p className="rounded-lg border border-oxblood/40 bg-oxblood/10 px-4 py-3 text-[13px] text-cream/75">
                {loadError} — you can still request the table and the concierge will call you back.
              </p>
            ) : null}

            <div className="flex justify-between">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="label-xs rounded-full border border-gold/25 px-6 py-3.5 text-cream/70 transition hover:border-gold hover:text-cream"
              >
                ← Back
              </button>
              <button
                type="button"
                onClick={() => {
                  if (!slot) {
                    setError("Choose a seating time to continue.");
                    return;
                  }
                  setError("");
                  setStep(3);
                }}
                className="sheen flex items-center gap-3 rounded-full bg-gold px-7 py-4 text-[10.5px] font-semibold tracking-[0.22em] text-ink uppercase transition hover:bg-champagne"
              >
                Your details <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        ) : null}

        {/* STEP 3 */}
        {step === 3 ? (
          <div className="animate-fade-up space-y-7">
            <h2 className="font-display text-2xl text-cream">Who shall we ask for?</h2>

            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Full name" value={name} onChange={setName} placeholder="Aarav Shah" autoComplete="name" />
              <Field label="Phone" value={phone} onChange={setPhone} placeholder="+91 98200 00000" type="tel" autoComplete="tel" />
              <Field label="Email" value={email} onChange={setEmail} placeholder="you@email.com" type="email" autoComplete="email" className="sm:col-span-2" />
            </div>

            <div>
              <label className="label-xs text-gold" htmlFor="occasion">
                Occasion
              </label>
              <select
                id="occasion"
                value={occasion}
                onChange={(e) => setOccasion(e.target.value)}
                className="mt-2.5 w-full rounded-lg border border-gold/20 bg-mocha px-4 py-3.5 text-[14px] text-cream focus:border-gold focus:outline-none"
              >
                {OCCASIONS.map((o) => (
                  <option key={o} value={o}>
                    {o}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="label-xs text-gold" htmlFor="requests">
                Anything the floor manager should know?
              </label>
              <textarea
                id="requests"
                value={requests}
                onChange={(e) => setRequests(e.target.value)}
                rows={4}
                maxLength={600}
                placeholder="A quiet corner, a cake at 21:00, allergies, a wheelchair-accessible route…"
                className="mt-2.5 w-full resize-none rounded-lg border border-gold/20 bg-mocha px-4 py-3.5 text-[14px] leading-relaxed text-cream placeholder:text-muted/55 focus:border-gold focus:outline-none"
              />
              <p className="mt-1.5 text-right text-[11px] text-muted tabular-nums">{requests.length}/600</p>
            </div>

            {error ? (
              <p className="rounded-lg border border-oxblood/45 bg-oxblood/10 px-4 py-3 text-[13px] text-cream/80">
                {error}
              </p>
            ) : null}

            <div className="flex flex-wrap justify-between gap-3">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="label-xs rounded-full border border-gold/25 px-6 py-3.5 text-cream/70 transition hover:border-gold hover:text-cream"
              >
                ← Back to seatings
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="sheen flex items-center gap-3 rounded-full bg-gold px-8 py-4 text-[10.5px] font-semibold tracking-[0.22em] text-ink uppercase transition hover:bg-champagne disabled:opacity-60"
              >
                {submitting ? "Holding your table…" : "Confirm reservation"}
                <ArrowRight className={`h-4 w-4 ${submitting ? "animate-pulse" : ""}`} />
              </button>
            </div>
          </div>
        ) : null}
      </div>

      {/* live summary */}
      <aside className="lg:sticky lg:top-28 lg:self-start">
        <div className="overflow-hidden rounded-2xl border border-gold/20 bg-mocha/50">
          <p className="label-xs border-b border-gold/15 bg-espresso px-6 py-4 text-gold">Your table</p>
          <dl className="divide-y divide-gold/12 px-6">
            <Row k="Date" v={prettyDate(date)} />
            <Row k="Seating" v={slot || "Not chosen yet"} muted={!slot} />
            <Row k="Guests" v={`${guests} ${guests === 1 ? "guest" : "guests"}`} />
            <Row k="Zone" v={zone} />
            <Row k="Occasion" v={occasion === OCCASIONS[0] ? "—" : occasion} />
          </dl>
          <div className="border-t border-gold/15 px-6 py-5">
            <p className="text-[12.5px] leading-relaxed text-cream/55">
              Tables are held twenty minutes past the seating time. Cancellations up to four hours
              before are free; later than that we charge ₹500 a guest for the Private Salon.
            </p>
            <a
              href={waLink(`Hello ABsip, I'd like to reserve ${zone} for ${guests} on ${prettyDate(date)}.`)}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 flex items-center justify-center gap-2 rounded-full border border-gold/30 px-5 py-3 text-[10.5px] font-semibold tracking-[0.18em] text-cream uppercase transition hover:border-gold hover:bg-gold/10"
            >
              <WhatsAppIcon className="h-4 w-4 text-[#25D366]" /> Book via WhatsApp
            </a>
          </div>
        </div>

        <div className="mt-5 rounded-2xl border border-gold/15 bg-espresso/70 p-6">
          <p className="label-xs text-gold">House notes</p>
          <ul className="mt-4 space-y-3 text-[13px] leading-relaxed text-cream/60">
            <li className="flex gap-2.5">
              <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-gold/70" />
              Smart casual. No shorts at the Chef's Counter after 19:00.
            </li>
            <li className="flex gap-2.5">
              <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-gold/70" />
              Laptops are welcome until 18:00, then the north alcove goes screen-free.
            </li>
            <li className="flex gap-2.5">
              <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-gold/70" />
              Children of all ages, with a small menu of warm milk drinks.
            </li>
            <li className="flex gap-2.5">
              <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-gold/70" />
              Valet parking at the Hill Road entrance from 18:00.
            </li>
          </ul>
        </div>
      </aside>
    </form>
  );
}

function Row({ k, v, muted }: { k: string; v: string; muted?: boolean }) {
  return (
    <div className="flex items-baseline justify-between gap-4 py-3.5">
      <dt className="label-xs text-muted">{k}</dt>
      <dd className={`text-right text-[13.5px] ${muted ? "text-muted italic" : "text-cream"}`}>{v}</dd>
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
      <label className="label-xs text-gold" htmlFor={`f-${label}`}>
        {label}
      </label>
      <input
        id={`f-${label}`}
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
