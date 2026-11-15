"use client";

import { useCallback, useEffect, useState } from "react";

import { ArrowRight, StarIcon } from "@/components/Icons";

type Quote = { quote: string; name: string; role: string };

export default function Testimonials({ items }: { items: Quote[] }) {
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);

  const go = useCallback((dir: number) => setI((v) => (v + dir + items.length) % items.length), [items.length]);

  useEffect(() => {
    if (paused || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = window.setInterval(() => go(1), 7000);
    return () => window.clearInterval(t);
  }, [paused, go]);

  return (
    <div
      className="relative"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="relative min-h-[19rem] overflow-hidden rounded-xl border border-gold/15 bg-mocha/60 px-6 py-10 sm:px-12 sm:py-14">
        <span className="pointer-events-none absolute -top-8 left-4 font-display text-[10rem] leading-none text-gold/8 select-none">
          &ldquo;
        </span>
        {items.map((q, idx) => (
          <figure
            key={q.name}
            className={`relative transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
              idx === i ? "translate-y-0 opacity-100" : "pointer-events-none absolute inset-x-6 translate-y-6 opacity-0 sm:inset-x-12"
            }`}
            aria-hidden={idx !== i}
          >
            <div className="mb-5 flex gap-1 text-gold">
              {Array.from({ length: 5 }).map((_, s) => (
                <StarIcon key={s} className="h-3.5 w-3.5" />
              ))}
            </div>
            <blockquote className="font-display text-[clamp(1.25rem,2.6vw,1.95rem)] leading-[1.45] text-cream/90 italic">
              {q.quote}
            </blockquote>
            <figcaption className="mt-7 flex items-center gap-4">
              <span className="h-px w-10 bg-gold/50" />
              <div>
                <p className="text-[13px] font-medium tracking-[0.16em] text-champagne uppercase">{q.name}</p>
                <p className="text-[12px] text-muted">{q.role}</p>
              </div>
            </figcaption>
          </figure>
        ))}
      </div>

      <div className="mt-6 flex items-center justify-between">
        <div className="flex gap-2">
          {items.map((q, idx) => (
            <button
              key={q.name}
              type="button"
              onClick={() => setI(idx)}
              aria-label={`Show quote from ${q.name}`}
              className={`h-1.5 rounded-full transition-all duration-500 ${
                idx === i ? "w-10 bg-gold" : "w-4 bg-gold/25 hover:bg-gold/50"
              }`}
            />
          ))}
        </div>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => go(-1)}
            aria-label="Previous quote"
            className="rounded-full border border-gold/25 p-2.5 text-cream/70 transition hover:border-gold hover:text-champagne"
          >
            <ArrowRight className="h-4 w-4 rotate-180" />
          </button>
          <button
            type="button"
            onClick={() => go(1)}
            aria-label="Next quote"
            className="rounded-full border border-gold/25 p-2.5 text-cream/70 transition hover:border-gold hover:text-champagne"
          >
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
