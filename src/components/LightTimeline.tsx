"use client";

import { useState } from "react";
import Image from "next/image";

import { AMBIENCE } from "@/lib/images";
import { SparkIcon, WaveIcon } from "@/components/Icons";

const SCENES = [
  {
    time: "08:00",
    name: "First light",
    image: AMBIENCE.counter,
    kelvin: "3200 K",
    lux: "180 lux",
    playlist: "Piano · Bill Evans, Keith Jarrett",
    scent: "Fresh grounds, warm butter, orange peel",
    note: "Shutters up, lamps at a quarter. The room belongs to people with a newspaper and a cortado.",
    tint: "rgba(236,213,155,0.10)",
  },
  {
    time: "12:30",
    name: "Midday service",
    image: AMBIENCE.grandHall,
    kelvin: "3600 K",
    lux: "260 lux",
    playlist: "Bossa nova · Stan Getz, João Gilberto",
    scent: "Espresso, focaccia, cut basil",
    note: "Every pendant on, daylight through the arched windows, the pass running flat out.",
    tint: "rgba(236,213,155,0.06)",
  },
  {
    time: "18:00",
    name: "Golden hour",
    image: AMBIENCE.marquee,
    kelvin: "2700 K",
    lux: "150 lux",
    playlist: "Soul · Curtis Mayfield, Sade",
    scent: "Caramelised sugar, chestnut, cedar",
    note: "The marquee bulbs come on and the terrace turns amber for ninety minutes.",
    tint: "rgba(201,164,76,0.14)",
  },
  {
    time: "21:00",
    name: "Terrace noir",
    image: AMBIENCE.kyotoNight,
    kelvin: "2200 K",
    lux: "70 lux",
    playlist: "Oud & upright bass · live Fridays",
    scent: "Olive wood smoke, cherry, sea air",
    note: "Candle-only on the terrace, lamps dimmed to a glow, the sea below and a musician in the corner.",
    tint: "rgba(107,31,39,0.20)",
  },
  {
    time: "23:30",
    name: "Late noir",
    image: AMBIENCE.redLounge,
    kelvin: "1900 K",
    lux: "38 lux",
    playlist: "Blue note · Chet Baker, Alice Coltrane",
    scent: "Cacao, tobacco leaf, old paper",
    note: "The oxblood lounge, one lamp a table, conversation at half volume until the doors close.",
    tint: "rgba(107,31,39,0.28)",
  },
];

export default function LightTimeline() {
  const [i, setI] = useState(3);
  const scene = SCENES[i];

  return (
    <div className="overflow-hidden rounded-2xl border border-gold/20 bg-espresso">
      <div className="relative h-[320px] sm:h-[420px]">
        {SCENES.map((s, idx) => (
          <div
            key={s.time}
            className={`absolute inset-0 transition-opacity duration-[1200ms] ${
              idx === i ? "opacity-100" : "opacity-0"
            }`}
          >
            <Image
              src={s.image}
              alt={`${s.name} at ${s.time}`}
              fill
              sizes="(max-width: 640px) 100vw, 900px"
              className={`object-cover ${idx === i ? "animate-ken-burns" : ""}`}
              priority={idx === 0}
            />
            <div className="absolute inset-0" style={{ background: s.tint }} />
            <div className="absolute inset-0 bg-gradient-to-t from-espresso via-espresso/20 to-transparent" />
          </div>
        ))}

        <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8">
          <p className="label-xs text-gold">{scene.time} · {scene.name}</p>
          <p className="mt-2 max-w-xl font-display text-[clamp(1.1rem,2.2vw,1.5rem)] leading-snug text-cream/90 italic">
            {scene.note}
          </p>
        </div>
      </div>

      <div className="border-t border-gold/15 px-6 py-6 sm:px-8">
        <input
          type="range"
          min={0}
          max={SCENES.length - 1}
          step={1}
          value={i}
          onChange={(e) => setI(Number(e.target.value))}
          aria-label="Time of day in the room"
          className="h-1 w-full cursor-pointer appearance-none rounded-full bg-gold/25 accent-gold"
        />
        <div className="mt-3 flex justify-between">
          {SCENES.map((s, idx) => (
            <button
              key={s.time}
              type="button"
              onClick={() => setI(idx)}
              className={`text-[10px] tracking-[0.14em] uppercase transition ${
                idx === i ? "text-champagne" : "text-muted hover:text-cream/70"
              }`}
            >
              {s.time}
            </button>
          ))}
        </div>

        <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { icon: <SparkIcon className="h-4 w-4" />, k: "Light temperature", v: scene.kelvin },
            { icon: <SparkIcon className="h-4 w-4" />, k: "Level at table", v: scene.lux },
            { icon: <WaveIcon className="h-4 w-4" />, k: "On the speakers", v: scene.playlist },
            { icon: <SparkIcon className="h-4 w-4" />, k: "In the air", v: scene.scent },
          ].map((f) => (
            <div key={f.k} className="rounded-lg border border-gold/15 bg-mocha/50 p-4">
              <span className="flex items-center gap-2 text-[9.5px] tracking-[0.2em] text-gold/80 uppercase">
                {f.icon} {f.k}
              </span>
              <p className="mt-2 text-[13px] leading-snug text-cream/85">{f.v}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
