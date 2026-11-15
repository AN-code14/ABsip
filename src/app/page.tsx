import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import HeroScene from "@/components/HeroScene";
import Marquee from "@/components/Marquee";
import OpenStatusPill from "@/components/OpenStatusPill";
import Reveal from "@/components/Reveal";
import SectionHeading from "@/components/SectionHeading";
import SignatureRail from "@/components/SignatureRail";
import StatsCounters from "@/components/StatsCounters";
import Testimonials from "@/components/Testimonials";
import {
  ArrowRight,
  BeanIcon,
  ChairIcon,
  ChefIcon,
  ClockIcon,
  PinIcon,
  ScooterIcon,
  SparkIcon,
  TrayIcon,
  WaveIcon,
} from "@/components/Icons";
import { AMBIENCE, BAR, BREWS, KITCHEN } from "@/lib/images";
import { getSignaturesSafe } from "@/lib/data";
import { CAFE, ZONES, waLink } from "@/lib/site";
import { PRESS, TESTIMONIALS } from "@/db/seed-data";

export const metadata: Metadata = {
  title: "ABsip — A Single-Origin Sanctuary",
  description:
    "Step inside ABsip in three dimensions: reserve one of six seating zones, order the reserve menu to your table or door, and wander the eight rooms of the house.",
};

export const dynamic = "force-dynamic";

const RITUAL = [
  {
    step: "01",
    title: "Selection",
    copy:
      "Green beans are bought at auction and directly from four Indian estates plus two rotating international lots. Every sack is cupped on the loft table before it earns a place on the menu.",
    image: BREWS.cappuccinoBeans,
    meta: "6 estates · 40 lots a year",
  },
  {
    step: "02",
    title: "Roast",
    copy:
      "A 1974 Probat UG-15 drum, restored in Vienna, runs at 12 kg a batch. Development time is logged to the second; nothing is roasted more than four days before it is served.",
    image: KITCHEN.cacaoRolls,
    meta: "Probat drum · 4-day rest",
  },
  {
    step: "03",
    title: "The pour",
    copy:
      "Water is remineralised in-house to 78 ppm. Espresso is dialled twice a day; manual brews are made at your table so you can watch the bloom and smell the crust break.",
    image: BREWS.latteTopView,
    meta: "78 ppm · table-side brewing",
  },
  {
    step: "04",
    title: "The table",
    copy:
      "Bone china warmed to 55°C, a brass tray, one glass of sparkling water, and a card naming the lot, the farmer and the altitude. Then we leave you alone with it.",
    image: AMBIENCE.counter,
    meta: "Warm porcelain · lot card",
  },
];

const POSTCARDS = [
  { src: AMBIENCE.grandHall, title: "Grand Hall", rotate: "-3deg", span: "sm:col-span-7 h-72" },
  { src: AMBIENCE.redLounge, title: "Oxblood Lounge", rotate: "2.5deg", span: "sm:col-span-5 h-72" },
  { src: AMBIENCE.kyotoNight, title: "Terrace Noir", rotate: "1.5deg", span: "sm:col-span-4 h-64" },
  { src: AMBIENCE.chandeliers, title: "Library Wing", rotate: "-2deg", span: "sm:col-span-4 h-64" },
  { src: AMBIENCE.marquee, title: "The Marquee", rotate: "3deg", span: "sm:col-span-4 h-64" },
];

export default async function Home() {
  const signatures = await getSignaturesSafe(6);

  return (
    <>
      {/* ───────────────── 3D HERO ───────────────── */}
      <section className="grain relative flex min-h-[100svh] flex-col overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_18%,#241a12_0%,#120e0a_42%,#0a0806_78%)]" />
        <div className="absolute inset-x-0 top-0 h-72 bg-[linear-gradient(180deg,rgba(10,8,6,0.9),transparent)]" />
        <HeroScene />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_28%,rgba(10,8,6,0.72)_78%,rgba(10,8,6,0.95)_100%)]" />

        {/* vertical side rail */}
        <div className="pointer-events-none absolute top-1/2 left-6 hidden -translate-y-1/2 xl:block">
          <p className="label-xs rotate-180 text-muted [writing-mode:vertical-rl]">
            24 Pali Naka · Bandra West · Mumbai
          </p>
        </div>
        <div className="pointer-events-none absolute top-1/2 right-6 hidden -translate-y-1/2 xl:block">
          <p className="label-xs text-muted [writing-mode:vertical-rl]">
            Roastery loft · Ninety seats · Six zones
          </p>
        </div>

        <div className="relative mx-auto flex w-full max-w-[1400px] flex-1 flex-col justify-between px-5 pt-28 pb-10 sm:px-8">
          <div className="max-w-3xl">
            <Reveal>
              <div className="flex items-center gap-3">
                <span className="h-px w-12 bg-gold/60" />
                <span className="label-xs text-gold">Luxury coffee house · Est. {CAFE.established}</span>
              </div>
            </Reveal>

            <Reveal delay={90}>
              <h1 className="mt-6 font-display text-[clamp(3.6rem,13vw,10.5rem)] leading-[0.82] font-medium tracking-[-0.03em] text-cream">
                AB<span className="text-gilt italic">sip</span>
              </h1>
            </Reveal>

            <Reveal delay={180}>
              <p className="mt-6 max-w-xl font-display text-[clamp(1.15rem,2.3vw,1.7rem)] leading-snug text-parchment/90 italic">
                A single-origin sanctuary where the room is as carefully composed as the cup.
              </p>
              <p className="mt-4 max-w-lg text-[14.5px] leading-relaxed text-cream/55">
                Ninety seats across eight rooms. Reserve the Window Gallery, order the Geisha reserve
                to your table, or have the kitchen deliver in lacquer boxes anywhere within six
                kilometres of Hill Road.
              </p>
            </Reveal>

            <Reveal delay={260}>
              <div className="mt-9 flex flex-wrap items-center gap-3">
                <Link
                  href="/book"
                  className="sheen group flex items-center gap-3 rounded-full bg-gold px-7 py-4 text-[11px] font-semibold tracking-[0.22em] text-ink uppercase transition hover:bg-champagne"
                >
                  <ChairIcon className="h-4 w-4" />
                  Reserve a table
                  <ArrowRight className="h-4 w-4 transition-transform duration-500 group-hover:translate-x-1" />
                </Link>
                <Link
                  href="/menu"
                  className="flex items-center gap-3 rounded-full border border-gold/35 px-7 py-4 text-[11px] font-semibold tracking-[0.22em] text-cream uppercase transition hover:border-gold hover:bg-gold/10"
                >
                  <BeanIcon className="h-4 w-4 text-gold" />
                  Explore the menu
                </Link>
                <Link
                  href="/order"
                  className="flex items-center gap-2 text-[11px] tracking-[0.2em] text-cream/60 uppercase transition hover:text-champagne"
                >
                  <TrayIcon className="h-4 w-4 text-gold/70" />
                  Order in
                </Link>
              </div>
            </Reveal>
          </div>

          <Reveal delay={340}>
            <div className="mt-14 flex flex-wrap items-end justify-between gap-6 border-t border-gold/15 pt-6">
              <div className="flex flex-wrap items-center gap-x-8 gap-y-3">
                <OpenStatusPill />
                <span className="hidden items-center gap-2 text-[11px] tracking-[0.16em] text-cream/45 uppercase sm:flex">
                  <PinIcon className="h-3.5 w-3.5 text-gold/70" /> {CAFE.addressLine1}
                </span>
                <span className="hidden items-center gap-2 text-[11px] tracking-[0.16em] text-cream/45 uppercase md:flex">
                  <ClockIcon className="h-3.5 w-3.5 text-gold/70" /> Today {CAFE.hours[new Date().getDay() === 0 ? 6 : new Date().getDay() - 1].time}
                </span>
              </div>
              <div className="flex items-center gap-3 text-[10px] tracking-[0.24em] text-muted uppercase">
                <span className="hidden sm:inline">Move your cursor — the room follows</span>
                <span className="flex h-8 w-5 items-start justify-center rounded-full border border-gold/30 p-1">
                  <span className="h-1.5 w-1 animate-bounce rounded-full bg-gold" />
                </span>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ───────────────── PRESS MARQUEE ───────────────── */}
      <div className="border-y border-gold/15 bg-espresso py-4">
        <Marquee>
          {PRESS.concat(PRESS).map((p, i) => (
            <span key={`${p.name}-${i}`} className="flex items-center gap-4 px-8">
              <SparkIcon className="h-3.5 w-3.5 text-gold/70" />
              <span className="text-[11px] tracking-[0.28em] text-cream/70 uppercase">{p.name}</span>
              <span className="font-display text-[13px] text-gold/80 italic">{p.line}</span>
            </span>
          ))}
        </Marquee>
      </div>

      {/* ───────────────── THE RITUAL (sticky two-column) ───────────────── */}
      <section className="relative mx-auto max-w-[1400px] px-5 py-24 sm:px-8 lg:py-32">
        <div className="grid gap-14 lg:grid-cols-[0.85fr_1.15fr]">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <SectionHeading
              eyebrow="Four movements"
              title={
                <>
                  The ritual,
                  <br />
                  <span className="text-gilt italic">from sack to table</span>
                </>
              }
              lede="Nothing at ABsip is hurried. The path a bean takes to your cup involves four pairs of hands, a 1974 drum roaster and a great deal of patience."
            />
            <Reveal delay={140}>
              <div className="mt-9 flex items-center gap-5 rounded-xl border border-gold/15 bg-mocha/50 p-5">
                <WaveIcon className="h-8 w-8 shrink-0 text-gold/70" />
                <p className="text-[13.5px] leading-relaxed text-cream/60">
                  Every cup is logged: lot, roast date, water mineral content and the barista who
                  pulled it. Ask and we will show you the card.
                </p>
              </div>
            </Reveal>
            <Reveal delay={220}>
              <Link
                href="/ambience"
                className="group mt-8 inline-flex items-center gap-3 text-[11px] tracking-[0.22em] text-gold uppercase transition hover:text-champagne"
              >
                Walk through the rooms
                <ArrowRight className="h-4 w-4 transition-transform duration-500 group-hover:translate-x-2" />
              </Link>
            </Reveal>
          </div>

          <ol className="space-y-8">
            {RITUAL.map((r, i) => (
              <Reveal as="li" key={r.step} delay={i * 90}>
                <article className="group grid gap-6 overflow-hidden rounded-xl border border-gold/12 bg-mocha/40 p-5 transition-all duration-500 hover:border-gold/35 hover:bg-mocha/70 sm:grid-cols-[190px_1fr] sm:p-6">
                  <div className="relative h-40 overflow-hidden rounded-lg sm:h-full sm:min-h-[190px]">
                    <Image
                      src={r.image}
                      alt={r.title}
                      fill
                      sizes="(max-width: 640px) 100vw, 190px"
                      className="object-cover transition-transform duration-[1.4s] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-ink/60 to-transparent" />
                  </div>
                  <div className="flex flex-col">
                    <div className="flex items-baseline gap-4">
                      <span className="font-display text-3xl text-gold/45 tabular-nums">{r.step}</span>
                      <h3 className="font-display text-[26px] leading-tight text-cream">{r.title}</h3>
                    </div>
                    <p className="mt-3 text-[14px] leading-relaxed text-cream/58">{r.copy}</p>
                    <p className="label-xs mt-auto pt-5 text-gold/70">{r.meta}</p>
                  </div>
                </article>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      {/* ───────────────── SIGNATURES ───────────────── */}
      <section className="relative border-y border-gold/12 bg-espresso/60 py-24 lg:py-28">
        <div className="mx-auto max-w-[1400px] px-5 sm:px-8">
          <SectionHeading
            eyebrow="The house signatures"
            title={
              <>
                Six things we are
                <br />
                <span className="text-gilt italic">known for</span>
              </>
            }
            lede="Pulled straight from tonight's menu. Tap any plate for the full story, the pairing and the provenance — or add it to your tray and order in."
            aside={
              <Link
                href="/menu"
                className="group flex items-center gap-3 rounded-full border border-gold/30 px-6 py-3.5 text-[10.5px] font-semibold tracking-[0.22em] text-cream uppercase transition hover:border-gold hover:bg-gold hover:text-ink"
              >
                Full menu — 35 items
                <ArrowRight className="h-4 w-4 transition-transform duration-500 group-hover:translate-x-1.5" />
              </Link>
            }
          />
          <div className="mt-12">
            <SignatureRail items={signatures} />
          </div>
        </div>
      </section>

      {/* ───────────────── AMBIENCE POSTCARDS ───────────────── */}
      <section className="mx-auto max-w-[1400px] px-5 py-24 sm:px-8 lg:py-32">
        <SectionHeading
          eyebrow="Eight rooms, one address"
          align="center"
          title={
            <>
              An ambience you can
              <span className="text-gilt italic"> almost smell</span>
            </>
          }
          lede="Hand-thrown plaster, mohair velvet, two hundred filament bulbs and a sound system tuned to 68 decibels so you can still hear the person opposite you."
        />

        <div className="mt-14 grid gap-5 sm:grid-cols-12">
          {POSTCARDS.map((p, i) => (
            <Reveal key={p.title} className={`${p.span} col-span-12`} delay={i * 80}>
              <Link
                href="/ambience"
                className="group relative block h-full w-full overflow-hidden rounded-xl border border-gold/12"
                style={{ transform: `rotate(${p.rotate})` }}
              >
                <Image
                  src={p.src}
                  alt={p.title}
                  fill
                  sizes="(max-width: 640px) 100vw, 50vw"
                  className="object-cover transition-transform duration-[1.6s] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-115"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/25 to-transparent opacity-90 transition-opacity duration-500 group-hover:opacity-70" />
                <div className="absolute inset-x-0 bottom-0 flex items-end justify-between p-5">
                  <div>
                    <p className="label-xs text-gold">Room 0{i + 1}</p>
                    <h3 className="mt-1.5 font-display text-2xl text-cream">{p.title}</h3>
                  </div>
                  <ArrowRight className="h-5 w-5 -rotate-45 text-gold opacity-0 transition-all duration-500 group-hover:rotate-0 group-hover:opacity-100" />
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ───────────────── STATS ───────────────── */}
      <section className="border-y border-gold/12 bg-espresso/50 px-5 py-20 sm:px-8">
        <div className="mx-auto max-w-[1400px]">
          <StatsCounters
            stats={[
              { value: 214800, label: "Cups poured", note: "Since the doors opened in 2019" },
              { value: 40, suffix: "+", label: "Estate lots", note: "Cupped on the loft table each year" },
              { value: 8, label: "Rooms & zones", note: "From the hushed north alcove to the terrace" },
              { value: 12, suffix: " min", label: "Average seat time", note: "From booking request to coffee in hand" },
            ]}
          />
        </div>
      </section>

      {/* ───────────────── TWO PILLARS ───────────────── */}
      <section className="mx-auto max-w-[1400px] px-5 py-24 sm:px-8 lg:py-28">
        <div className="grid gap-6 lg:grid-cols-2">
          <Reveal>
            <article className="group relative flex h-full flex-col justify-end overflow-hidden rounded-2xl border border-gold/15 p-8 lg:p-10">
              <Image
                src={AMBIENCE.chandeliers}
                alt="The Library wing at ABsip"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover transition-transform duration-[1.8s] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-108"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/72 to-ink/25" />
              <div className="relative">
                <span className="label-xs flex items-center gap-2 text-gold">
                  <ChairIcon className="h-4 w-4" /> Table booking
                </span>
                <h3 className="mt-4 font-display text-[clamp(1.9rem,3.4vw,2.8rem)] leading-tight text-cream">
                  Hold a seat in
                  <span className="text-gilt italic"> six zones</span>
                </h3>
                <p className="mt-3 max-w-md text-[14.5px] leading-relaxed text-cream/60">
                  Live availability across morning, afternoon, evening and late noir seatings. Choose
                  your room, tell us the occasion, and the concierge confirms in minutes.
                </p>
                <ul className="mt-6 flex flex-wrap gap-2">
                  {ZONES.slice(0, 4).map((z) => (
                    <li
                      key={z.id}
                      className="rounded-full border border-gold/20 bg-ink/50 px-3 py-1.5 text-[10px] tracking-[0.16em] text-cream/70 uppercase backdrop-blur"
                    >
                      {z.name}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/book"
                  className="mt-8 inline-flex items-center gap-3 rounded-full bg-cream px-6 py-3.5 text-[10.5px] font-semibold tracking-[0.2em] text-ink uppercase transition group-hover:bg-gold"
                >
                  Check availability <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </article>
          </Reveal>

          <Reveal delay={120}>
            <article className="group relative flex h-full flex-col justify-end overflow-hidden rounded-2xl border border-gold/15 p-8 lg:p-10">
              <Image
                src={KITCHEN.artisticPlate}
                alt="A plated dish from the ABsip kitchen"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover transition-transform duration-[1.8s] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-108"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/72 to-ink/25" />
              <div className="relative">
                <span className="label-xs flex items-center gap-2 text-gold">
                  <TrayIcon className="h-4 w-4" /> Food ordering
                </span>
                <h3 className="mt-4 font-display text-[clamp(1.9rem,3.4vw,2.8rem)] leading-tight text-cream">
                  The kitchen,
                  <span className="text-gilt italic"> delivered</span>
                </h3>
                <p className="mt-3 max-w-md text-[14.5px] leading-relaxed text-cream/60">
                  Order to your reserved table, collect from the marble pass, or have the concierge
                  carry it to your door in thermal lacquer boxes within six kilometres.
                </p>
                <div className="mt-6 grid grid-cols-3 gap-3">
                  {[
                    { icon: <ChefIcon className="h-4 w-4" />, k: "35", v: "menu items" },
                    { icon: <ScooterIcon className="h-4 w-4" />, k: "35–50", v: "min delivery" },
                    { icon: <ClockIcon className="h-4 w-4" />, k: "01:00", v: "last order" },
                  ].map((f) => (
                    <div key={f.v} className="rounded-lg border border-gold/20 bg-ink/50 p-3 backdrop-blur">
                      <span className="text-gold">{f.icon}</span>
                      <p className="mt-2 font-display text-lg text-cream">{f.k}</p>
                      <p className="text-[10px] tracking-[0.14em] text-muted uppercase">{f.v}</p>
                    </div>
                  ))}
                </div>
                <Link
                  href="/order"
                  className="mt-8 inline-flex items-center gap-3 rounded-full bg-cream px-6 py-3.5 text-[10.5px] font-semibold tracking-[0.2em] text-ink uppercase transition group-hover:bg-gold"
                >
                  Start an order <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </article>
          </Reveal>
        </div>
      </section>

      {/* ───────────────── TESTIMONIALS ───────────────── */}
      <section className="border-y border-gold/12 bg-espresso/60 px-5 py-24 sm:px-8">
        <div className="mx-auto grid max-w-[1400px] gap-12 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <SectionHeading
              eyebrow="In their words"
              title={
                <>
                  The room,
                  <br />
                  <span className="text-gilt italic">reviewed</span>
                </>
              }
            />
            <Reveal delay={120}>
              <div className="mt-8 rounded-xl border border-gold/15 bg-mocha/40 p-6">
                <p className="label-xs text-gold">Also on the card</p>
                <ul className="mt-4 space-y-3">
                  {[
                    { k: "Reserve brews", v: "40 cups per harvest" },
                    { k: "Chef's counter", v: "9 courses · 6 stools" },
                    { k: "Private salon", v: "Up to 18 guests" },
                  ].map((x) => (
                    <li key={x.k} className="flex items-baseline justify-between gap-3 text-[13px]">
                      <span className="text-cream/70">{x.k}</span>
                      <span className="h-px flex-1 translate-y-[-3px] bg-gold/15" />
                      <span className="text-muted">{x.v}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  href="/menu"
                  className="mt-5 inline-flex items-center gap-2 text-[11px] tracking-[0.2em] text-gold uppercase transition hover:text-champagne"
                >
                  See the whole menu <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </Reveal>
          </div>
          <Reveal delay={80}>
            <Testimonials items={TESTIMONIALS} />
          </Reveal>
        </div>
      </section>

      {/* ───────────────── RESERVE BAND ───────────────── */}
      <section className="relative overflow-hidden">
        <Image
          src={BAR.tokyoBar}
          alt="The zero-proof bar at ABsip"
          fill
          sizes="100vw"
          className="animate-ken-burns object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-ink via-ink/80 to-ink" />
        <div className="relative mx-auto grid max-w-[1400px] gap-12 px-5 py-24 sm:px-8 lg:grid-cols-[1.15fr_0.85fr]">
          <Reveal>
            <div>
              <SectionHeading
                eyebrow="Tonight at ABsip"
                title={
                  <>
                    The doors are open.
                    <br />
                    <span className="text-gilt italic">The kettle is on.</span>
                  </>
                }
              />
              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  href="/book"
                  className="sheen flex items-center gap-3 rounded-full bg-gold px-7 py-4 text-[11px] font-semibold tracking-[0.22em] text-ink uppercase transition hover:bg-champagne"
                >
                  <ChairIcon className="h-4 w-4" /> Book a table
                </Link>
                <a
                  href={waLink("Hello ABsip, I'd like to reserve a table for tonight.")}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 rounded-full border border-gold/35 px-7 py-4 text-[11px] font-semibold tracking-[0.22em] text-cream uppercase transition hover:border-gold hover:bg-gold/10"
                >
                  <SparkIcon className="h-4 w-4 text-gold" /> WhatsApp the concierge
                </a>
              </div>
              <p className="mt-8 max-w-lg text-[14px] leading-relaxed text-cream/55">
                Tables are held for twenty minutes past the seating time. For parties above eight,
                the Private Salon opens with its own barista and a hand-written menu.
              </p>
            </div>
          </Reveal>

          <Reveal delay={120}>
            <div className="rounded-2xl border border-gold/20 bg-ink/70 p-7 backdrop-blur-md">
              <p className="label-xs text-gold">Opening hours</p>
              <ul className="mt-5 space-y-2.5">
                {CAFE.hours.map((h) => (
                  <li key={h.day} className="flex items-baseline gap-3 text-[13px]">
                    <span className="w-24 text-cream/70">{h.day}</span>
                    <span className="h-px flex-1 translate-y-[-3px] bg-gold/15" />
                    <span className="text-cream/90 tabular-nums">{h.time}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-6 border-t border-gold/15 pt-5">
                <p className="flex items-start gap-2 text-[13px] leading-relaxed text-cream/60">
                  <PinIcon className="mt-0.5 h-4 w-4 shrink-0 text-gold/70" />
                  <span>
                    {CAFE.addressLine1}
                    <br />
                    {CAFE.addressLine2}
                  </span>
                </p>
                <p className="mt-3 text-[13px] text-cream/60">
                  <a href={`tel:${CAFE.phoneRaw}`} className="transition hover:text-champagne">
                    {CAFE.phoneDisplay}
                  </a>{" "}
                  ·{" "}
                  <a href={`mailto:${CAFE.email}`} className="transition hover:text-champagne">
                    {CAFE.email}
                  </a>
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ───────────────── CLOSING MARQUEE ───────────────── */}
      <div className="border-t border-gold/15 bg-espresso py-6">
        <Marquee speed="slow" reverse>
          {["Single-origin sanctuary", "Roastery loft", "Terrace noir", "Chef's counter", "Private salon", "Zero-proof bar"].map(
            (t, i) => (
              <span key={`${t}-${i}`} className="flex items-center gap-6 px-6">
                <BeanIcon className="h-4 w-4 text-gold/60" />
                <span className="font-display text-[clamp(1.4rem,3vw,2.4rem)] text-cream/25 italic">{t}</span>
              </span>
            ),
          )}
        </Marquee>
      </div>
    </>
  );
}
