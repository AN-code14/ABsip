import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import BookingForm from "@/components/BookingForm";
import Reveal from "@/components/Reveal";
import { ArrowRight, ChairIcon, ChefIcon, ClockIcon, SparkIcon } from "@/components/Icons";
import { AMBIENCE, BREWS } from "@/lib/images";
import { CAFE, ZONES, waLink } from "@/lib/site";

export const metadata: Metadata = {
  title: "Reserve a Table",
  description:
    "Live table availability across six zones at ABsip — Window Gallery, Library, Terrace Noir, Chef's Counter, Private Salon and the Roastery Loft.",
};

export const dynamic = "force-dynamic";

const ZONE_IMAGE: Record<string, string> = {
  "The Window Gallery": AMBIENCE.marquee,
  "The Library": AMBIENCE.chandeliers,
  "Terrace Noir": AMBIENCE.kyotoNight,
  "The Chef's Counter": AMBIENCE.counter,
  "The Private Salon": AMBIENCE.redLounge,
  "The Roastery Loft": AMBIENCE.bulbWindow,
};

const FAQ = [
  {
    q: "How long is the table held?",
    a: "Twenty minutes past your seating time. After that the floor manager releases it to the room — call the concierge if you are caught in Hill Road traffic and we will usually stretch it.",
  },
  {
    q: "Is there a minimum spend?",
    a: "The Window Gallery and Roastery Loft have none. The Library and Terrace Noir carry a per-guest minimum that is fully redeemable against food and beverage. The Private Salon has a room fee.",
  },
  {
    q: "Can I book the whole café?",
    a: "Yes. Full buyouts run from 22:00 and seat up to ninety guests, with a bespoke menu, your own barista and the marquee switched off if you prefer candlelight.",
  },
  {
    q: "Do you take walk-ins?",
    a: "Twelve of the ninety seats are kept for walk-ins every service, released from 08:00 at the marble pass. They go quickly after 19:00 on Fridays and Saturdays.",
  },
  {
    q: "Is the terrace open in the monsoon?",
    a: "The retractable canopy covers eight of the ten tables. When the wind picks up we move Terrace Noir guests into the Grand Hall and comp the first round.",
  },
];

export default function BookPage() {
  return (
    <>
      <section className="grain relative overflow-hidden border-b border-gold/15 pt-[68px]">
        <Image
          src={AMBIENCE.chandeliers}
          alt="The Library wing at ABsip"
          fill
          priority
          sizes="100vw"
          className="animate-ken-burns object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-ink/85 via-ink/72 to-ink" />
        <div className="relative mx-auto max-w-[1400px] px-5 py-20 sm:px-8 lg:py-24">
          <Reveal>
            <div className="flex items-center gap-3">
              <span className="h-px w-12 bg-gold/60" />
              <span className="label-xs text-gold">Reservations · Six zones</span>
            </div>
            <h1 className="mt-5 max-w-4xl font-display text-[clamp(2.6rem,7.4vw,6rem)] leading-[0.94] font-medium text-cream">
              Hold a seat in
              <br />
              <span className="text-gilt italic">the room you want</span>
            </h1>
            <p className="mt-6 max-w-xl text-[15px] leading-relaxed text-cream/60">
              Live floor plan, real seat counts, and confirmation the moment you submit. Sixty days
              ahead, parties of one to twenty, twenty-one seatings a night.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="mx-auto max-w-[1400px] px-5 py-16 sm:px-8">
        <BookingForm />
      </section>

      {/* zones gallery */}
      <section className="border-y border-gold/12 bg-espresso/60 px-5 py-20 sm:px-8">
        <div className="mx-auto max-w-[1400px]">
          <Reveal>
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <span className="label-xs flex items-center gap-2 text-gold">
                  <ChairIcon className="h-4 w-4" /> The floor plan
                </span>
                <h2 className="mt-3 font-display text-[clamp(1.9rem,4vw,3rem)] leading-tight text-cream">
                  Six rooms, <span className="text-gilt italic">six moods</span>
                </h2>
              </div>
              <p className="max-w-sm text-[13.5px] leading-relaxed text-cream/55">
                Each zone has its own lighting plot, playlist and service style. Pick the one that
                suits the evening you have in mind.
              </p>
            </div>
          </Reveal>

          <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {ZONES.map((z, i) => (
              <Reveal key={z.id} delay={i * 70}>
                <article className="group relative h-full overflow-hidden rounded-xl border border-gold/15 bg-mocha/40">
                  <div className="relative h-44 overflow-hidden">
                    <Image
                      src={ZONE_IMAGE[z.name] ?? BREWS.latteTopView}
                      alt={z.name}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover transition-transform duration-[1.5s] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-mocha via-mocha/30 to-transparent" />
                    <span className="absolute top-3 right-3 rounded-full bg-ink/75 px-3 py-1 text-[9.5px] tracking-[0.16em] text-champagne uppercase backdrop-blur">
                      {z.priceNote}
                    </span>
                  </div>
                  <div className="p-6">
                    <h3 className="font-display text-[22px] leading-tight text-cream">{z.name}</h3>
                    <p className="label-xs mt-2 text-gold/75">{z.seats}</p>
                    <p className="mt-3 text-[13px] leading-relaxed text-cream/55">{z.blurb}</p>
                    <p className="mt-4 border-t border-gold/12 pt-3 text-[10.5px] tracking-[0.14em] text-muted uppercase">
                      {z.tone}
                    </p>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* private events + faq */}
      <section className="mx-auto grid max-w-[1400px] gap-12 px-5 py-20 sm:px-8 lg:grid-cols-[0.95fr_1.05fr]">
        <Reveal>
          <div className="relative overflow-hidden rounded-2xl border border-gold/20">
            <Image
              src={AMBIENCE.redLounge}
              alt="The Private Salon at ABsip"
              fill
              sizes="(max-width: 1024px) 100vw, 45vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/70 to-ink/20" />
            <div className="relative p-8 pt-40">
              <span className="label-xs flex items-center gap-2 text-gold">
                <ChefIcon className="h-4 w-4" /> Private events
              </span>
              <h3 className="mt-3 font-display text-3xl leading-tight text-cream">
                The Private Salon
              </h3>
              <p className="mt-3 text-[14px] leading-relaxed text-cream/60">
                Eighteen seats, oxblood leather, its own barista and sound system. Birthdays,
                proposals, launch dinners and the occasional very serious board meeting.
              </p>
              <ul className="mt-6 space-y-2.5 text-[13px] text-cream/65">
                {[
                  "Hand-written menu agreed with the chef 72 hours ahead",
                  "Room fee ₹18,000, redeemable against food and beverage",
                  "Custom latte art, monogrammed napkins, cake service",
                  "Dedicated host from arrival to the last cup",
                ].map((l) => (
                  <li key={l} className="flex gap-2.5">
                    <SparkIcon className="mt-0.5 h-3.5 w-3.5 shrink-0 text-gold/70" />
                    {l}
                  </li>
                ))}
              </ul>
              <div className="mt-7 flex flex-wrap gap-3">
                <a
                  href={waLink("Hello ABsip, I'd like to plan a private event in the Salon.")}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="sheen rounded-full bg-gold px-6 py-3.5 text-[10.5px] font-semibold tracking-[0.2em] text-ink uppercase transition hover:bg-champagne"
                >
                  Plan an event
                </a>
                <Link
                  href="/ambience"
                  className="rounded-full border border-gold/35 px-6 py-3.5 text-[10.5px] font-semibold tracking-[0.2em] text-cream uppercase transition hover:border-gold hover:bg-gold/10"
                >
                  See the rooms
                </Link>
              </div>
            </div>
          </div>
        </Reveal>

        <Reveal delay={100}>
          <div>
            <span className="label-xs flex items-center gap-2 text-gold">
              <ClockIcon className="h-4 w-4" /> Good to know
            </span>
            <h2 className="mt-3 font-display text-[clamp(1.8rem,3.6vw,2.6rem)] text-cream">
              Reservation questions
            </h2>
            <div className="mt-7 divide-y divide-gold/12 border-y border-gold/12">
              {FAQ.map((f) => (
                <details key={f.q} className="group py-5">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4">
                    <span className="font-display text-[19px] leading-snug text-cream transition group-open:text-champagne">
                      {f.q}
                    </span>
                    <span className="shrink-0 text-gold transition-transform duration-300 group-open:rotate-45">
                      <ArrowRight className="h-4 w-4 rotate-90" />
                    </span>
                  </summary>
                  <p className="mt-3 max-w-xl text-[13.5px] leading-relaxed text-cream/58">{f.a}</p>
                </details>
              ))}
            </div>
            <div className="mt-8 rounded-xl border border-gold/15 bg-mocha/40 p-6">
              <p className="text-[13.5px] leading-relaxed text-cream/60">
                Prefer a human? The concierge desk answers between {CAFE.hours[0].time.split(" — ")[0]}{" "}
                and midnight, every day of the week.
              </p>
              <div className="mt-4 flex flex-wrap gap-3">
                <a
                  href={`tel:${CAFE.phoneRaw}`}
                  className="rounded-full border border-gold/30 px-5 py-2.5 text-[10.5px] font-semibold tracking-[0.18em] text-cream uppercase transition hover:border-gold hover:bg-gold/10"
                >
                  {CAFE.phoneDisplay}
                </a>
                <a
                  href={`mailto:${CAFE.email}`}
                  className="rounded-full border border-gold/30 px-5 py-2.5 text-[10.5px] font-semibold tracking-[0.18em] text-cream uppercase transition hover:border-gold hover:bg-gold/10"
                >
                  {CAFE.email}
                </a>
              </div>
            </div>
          </div>
        </Reveal>
      </section>
    </>
  );
}
