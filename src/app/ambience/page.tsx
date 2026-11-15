import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import AmbienceWall from "@/components/AmbienceWall";
import LightTimeline from "@/components/LightTimeline";
import Reveal from "@/components/Reveal";
import SectionHeading from "@/components/SectionHeading";
import { ArrowRight, BeanIcon, ChairIcon, SparkIcon, WaveIcon } from "@/components/Icons";
import { AMBIENCE, BREWS } from "@/lib/images";
import { AMBIENCE_GALLERY } from "@/db/seed-data";
import { CAFE, ZONES, waLink } from "@/lib/site";

export const metadata: Metadata = {
  title: "Ambience",
  description:
    "Eight rooms at ABsip — plaster, walnut, mohair and two hundred filament bulbs. Walk the lighting timeline from first light to late noir.",
};

const PALETTE = [
  { name: "Burma teak", where: "Banquettes, library ladder", detail: "Reclaimed from a 1930s Bandra bungalow, oiled by hand every month." },
  { name: "Carrara marble", where: "The pass, terrace tables", detail: "Forty-two slabs, honed not polished, so nothing glares under the lamps." },
  { name: "Mohair velvet", where: "Chaises, salon walls", detail: "Oxblood and bottle green, woven in Panipat, replaced seat by seat." },
  { name: "Hand-thrown plaster", where: "All nine walls", detail: "Trowelled in three coats with a mica finish that catches candlelight." },
  { name: "Unlacquered brass", where: "Fittings, tray, tap handles", detail: "Left to patina. Polished only at the entrance, twice a year." },
  { name: "Black stoneware", where: "Cups, tea bowls", detail: "Thrown in Khurja, glazed inside in cream, fired to 1260°C." },
];

const ARTEFACTS = [
  { name: "Probat UG-15, 1974", note: "Restored in Vienna, 12 kg a batch, still runs on the original drum bearings.", image: AMBIENCE.bulbWindow },
  { name: "The marquee sign, 1974", note: "Bought from a closing cinema on Linking Road; 96 bulbs, rewired by hand.", image: AMBIENCE.marquee },
  { name: "1,400 volumes", note: "The library wall: coffee agronomy, poetry, and every back issue of a food quarterly.", image: AMBIENCE.chandeliers },
  { name: "The gramophone", note: "A 1958 HMV in the north alcove, played on Sundays until the needle wears.", image: AMBIENCE.moodyChairs },
];

const HOUSE_RULES = [
  "Phones on silent, calls taken in the corridor by the marquee.",
  "Laptops welcome until 18:00 — after that the north alcove goes screen-free.",
  "Twelve of ninety seats are always kept for walk-ins.",
  "Photography without flash, and please keep other guests out of frame.",
  "The oud player takes requests between sets. Ask the host.",
  "Children welcome at any hour; warm milk with honey and cardamom is on the house.",
];

export default function AmbiencePage() {
  return (
    <>
      {/* hero */}
      <section className="grain relative flex min-h-[86svh] items-end overflow-hidden pt-[68px]">
        <Image
          src={AMBIENCE.grandHall}
          alt="The Grand Hall at ABsip"
          fill
          priority
          sizes="100vw"
          className="animate-ken-burns object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/60 to-ink/30" />
        <div className="relative mx-auto w-full max-w-[1400px] px-5 pb-16 sm:px-8">
          <Reveal>
            <div className="flex items-center gap-3">
              <span className="h-px w-12 bg-gold/60" />
              <span className="label-xs text-gold">Eight rooms · One address</span>
            </div>
            <h1 className="mt-5 max-w-4xl font-display text-[clamp(2.6rem,8vw,6.4rem)] leading-[0.92] font-medium text-cream">
              The room is the
              <br />
              <span className="text-gilt italic">second menu</span>
            </h1>
            <p className="mt-6 max-w-xl text-[15px] leading-relaxed text-cream/70">
              Plaster trowelled in three coats, two hundred and twelve filament bulbs on brass rods,
              a sound system tuned to 68 decibels so you can hear the person across the table — and
              nothing else. This is what we spent the first year building.
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <Link
                href="/book"
                className="sheen flex items-center gap-3 rounded-full bg-gold px-7 py-4 text-[10.5px] font-semibold tracking-[0.22em] text-ink uppercase transition hover:bg-champagne"
              >
                <ChairIcon className="h-4 w-4" /> Choose a room <ArrowRight className="h-4 w-4" />
              </Link>
              <a
                href={waLink("Hello ABsip, could I visit and see the rooms before booking?")}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full border border-gold/35 px-7 py-4 text-[10.5px] font-semibold tracking-[0.22em] text-cream uppercase transition hover:border-gold hover:bg-gold/10"
              >
                Ask for a walkthrough
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      {/* lighting timeline */}
      <section className="mx-auto max-w-[1400px] px-5 py-20 sm:px-8 lg:py-24">
        <SectionHeading
          eyebrow="A day in the light"
          title={
            <>
              From first light
              <span className="text-gilt italic"> to late noir</span>
            </>
          }
          lede="The lighting plot changes five times a day — colour temperature, level, playlist and scent all move together. Drag the dial to walk through the evening."
        />
        <Reveal delay={90}>
          <div className="mt-10">
            <LightTimeline />
          </div>
        </Reveal>
      </section>

      {/* gallery wall */}
      <section className="border-y border-gold/12 bg-espresso/60 px-5 py-20 sm:px-8">
        <div className="mx-auto max-w-[1400px]">
          <SectionHeading
            eyebrow="The wall"
            title={
              <>
                Eight rooms,
                <span className="text-gilt italic"> photographed at rest</span>
              </>
            }
            lede="Shot an hour before opening, before anyone sat down. Tap any frame to open it full size."
            aside={
              <p className="flex items-center gap-3 text-[12px] tracking-[0.18em] text-muted uppercase">
                <SparkIcon className="h-4 w-4 text-gold/70" /> {AMBIENCE_GALLERY.length} frames
              </p>
            }
          />
          <div className="mt-12">
            <AmbienceWall shots={AMBIENCE_GALLERY.map((s) => ({ ...s, span: s.span }))} />
          </div>
        </div>
      </section>

      {/* zones */}
      <section className="mx-auto max-w-[1400px] px-5 py-20 sm:px-8 lg:py-24">
        <SectionHeading
          eyebrow="Seating zones"
          title={
            <>
              Where you could
              <span className="text-gilt italic"> sit tonight</span>
            </>
          }
          lede="Six bookable zones across the house. Each has its own host, its own lighting plot and its own idea of what an evening should sound like."
        />
        <div className="mt-10 divide-y divide-gold/12 border-y border-gold/12">
          {ZONES.map((z, i) => (
            <Reveal key={z.id} delay={i * 50}>
              <Link href="/book" className="group grid gap-4 py-7 transition sm:grid-cols-[80px_1fr_1.2fr_auto] sm:items-center sm:gap-8">
                <span className="font-display text-2xl text-gold/40 tabular-nums transition group-hover:text-gold">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div>
                  <h3 className="font-display text-[24px] leading-tight text-cream transition group-hover:text-champagne">
                    {z.name}
                  </h3>
                  <p className="label-xs mt-1.5 text-gold/70">{z.seats}</p>
                </div>
                <p className="text-[13.5px] leading-relaxed text-cream/55">{z.blurb}</p>
                <div className="flex items-center gap-4 sm:flex-col sm:items-end">
                  <span className="text-[10.5px] tracking-[0.16em] text-muted uppercase">{z.tone}</span>
                  <ArrowRight className="h-5 w-5 text-gold transition-transform duration-500 group-hover:translate-x-1.5" />
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      {/* material palette + artefacts */}
      <section className="relative overflow-hidden border-y border-gold/12 bg-espresso">
        <Image src={AMBIENCE.moodyChairs} alt="" fill sizes="100vw" className="object-cover opacity-15" />
        <div className="absolute inset-0 bg-gradient-to-b from-espresso via-espresso/92 to-espresso" />
        <div className="relative mx-auto grid max-w-[1400px] gap-14 px-5 py-20 sm:px-8 lg:grid-cols-2">
          <div>
            <SectionHeading
              eyebrow="The material palette"
              title={
                <>
                  Six materials,
                  <br />
                  <span className="text-gilt italic">nothing else</span>
                </>
              }
              lede="A short list, strictly kept. If it isn't teak, marble, mohair, plaster, brass or stoneware, it didn't come into the building."
            />
            <ul className="mt-9 divide-y divide-gold/12 border-y border-gold/12">
              {PALETTE.map((p) => (
                <li key={p.name} className="group py-5 transition hover:bg-mocha/40">
                  <div className="flex items-baseline justify-between gap-4">
                    <h3 className="font-display text-[21px] text-cream transition group-hover:text-champagne">
                      {p.name}
                    </h3>
                    <span className="label-xs shrink-0 text-gold/70">{p.where}</span>
                  </div>
                  <p className="mt-2 text-[13px] leading-relaxed text-cream/55">{p.detail}</p>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <SectionHeading
              eyebrow="Artefacts"
              title={
                <>
                  Things with
                  <br />
                  <span className="text-gilt italic">a past</span>
                </>
              }
            />
            <div className="mt-9 grid gap-4 sm:grid-cols-2">
              {ARTEFACTS.map((a, i) => (
                <Reveal key={a.name} delay={i * 70}>
                  <article className="group relative h-full overflow-hidden rounded-xl border border-gold/15">
                    <div className="relative h-36 overflow-hidden">
                      <Image
                        src={a.image}
                        alt={a.name}
                        fill
                        sizes="(max-width: 640px) 100vw, 220px"
                        className="object-cover transition-transform duration-[1.5s] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-espresso to-transparent" />
                    </div>
                    <div className="p-5">
                      <h3 className="font-display text-[19px] leading-tight text-cream">{a.name}</h3>
                      <p className="mt-2 text-[12.5px] leading-relaxed text-cream/55">{a.note}</p>
                    </div>
                  </article>
                </Reveal>
              ))}
            </div>

            <Reveal delay={120}>
              <div className="mt-8 rounded-xl border border-gold/20 bg-ink/60 p-6 backdrop-blur">
                <p className="label-xs flex items-center gap-2 text-gold">
                  <WaveIcon className="h-4 w-4" /> House rules
                </p>
                <ul className="mt-4 space-y-2.5">
                  {HOUSE_RULES.map((r) => (
                    <li key={r} className="flex gap-2.5 text-[13px] leading-relaxed text-cream/60">
                      <BeanIcon className="mt-0.5 h-3.5 w-3.5 shrink-0 text-gold/60" />
                      {r}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* sensory strip */}
      <section className="mx-auto max-w-[1400px] px-5 py-20 sm:px-8">
        <div className="grid gap-5 md:grid-cols-3">
          {[
            {
              k: "68 dB",
              t: "Sound at the table",
              b: "Measured nightly with the room full. Louder than a whisper, quieter than a restaurant — you never raise your voice.",
              img: BREWS.dramaticShadow,
            },
            {
              k: "21°C",
              t: "Air, all year",
              b: "Underfloor cooling in summer, radiant panels in the monsoon. The terrace has copper heaters and wool throws.",
              img: AMBIENCE.kyotoNight,
            },
            {
              k: "212",
              t: "Filament bulbs",
              b: "Every bulb on a brass rod behind the roastery glass, dimmed on five separate circuits through the day.",
              img: AMBIENCE.bulbWindow,
            },
          ].map((c, i) => (
            <Reveal key={c.t} delay={i * 80}>
              <article className="group relative h-full overflow-hidden rounded-xl border border-gold/15">
                <Image
                  src={c.img}
                  alt={c.t}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover opacity-45 transition-all duration-[1.5s] group-hover:scale-108 group-hover:opacity-60"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/75 to-ink/25" />
                <div className="relative p-7">
                  <p className="font-display text-[clamp(2.4rem,5vw,3.4rem)] leading-none text-gilt">{c.k}</p>
                  <h3 className="mt-3 font-display text-xl text-cream">{c.t}</h3>
                  <p className="mt-2.5 text-[13px] leading-relaxed text-cream/60">{c.b}</p>
                </div>
              </article>
            </Reveal>
          ))}
        </div>

        <Reveal>
          <div className="mt-14 flex flex-col items-center gap-6 rounded-2xl border border-gold/20 bg-mocha/40 px-8 py-12 text-center">
            <h2 className="max-w-2xl font-display text-[clamp(1.8rem,4vw,2.8rem)] leading-tight text-cream">
              Come and sit in it before you decide.
            </h2>
            <p className="max-w-lg text-[14px] leading-relaxed text-cream/55">
              Walk-ins are welcome from {CAFE.hours[0].time.split(" — ")[0]} every morning, and we
              will happily show you the roastery loft if the cupping table is free.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Link
                href="/book"
                className="sheen flex items-center gap-3 rounded-full bg-gold px-7 py-4 text-[10.5px] font-semibold tracking-[0.22em] text-ink uppercase transition hover:bg-champagne"
              >
                Reserve a table <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/menu"
                className="rounded-full border border-gold/35 px-7 py-4 text-[10.5px] font-semibold tracking-[0.22em] text-cream uppercase transition hover:border-gold hover:bg-gold/10"
              >
                Read the menu
              </Link>
            </div>
          </div>
        </Reveal>
      </section>
    </>
  );
}
