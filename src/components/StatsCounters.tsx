"use client";

import { useEffect, useRef, useState } from "react";

import { numberFmt } from "@/lib/money";

type Stat = { value: number; suffix?: string; label: string; note: string };

export default function StatsCounters({ stats }: { stats: Stat[] }) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [run, setRun] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") {
      setRun(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setRun(true);
          io.disconnect();
        }
      },
      { threshold: 0.3 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref} className="grid gap-px overflow-hidden rounded-xl border border-gold/15 bg-gold/15 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((s, i) => (
        <Counter key={s.label} stat={s} run={run} delay={i * 140} />
      ))}
    </div>
  );
}

function Counter({ stat, run, delay }: { stat: Stat; run: boolean; delay: number }) {
  const [n, setN] = useState(0);

  useEffect(() => {
    if (!run) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setN(stat.value);
      return;
    }
    let raf = 0;
    const start = performance.now() + delay;
    const dur = 1500;
    const tick = (now: number) => {
      const p = Math.min(1, Math.max(0, (now - start) / dur));
      const eased = 1 - Math.pow(1 - p, 3);
      setN(Math.round(stat.value * eased));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [run, stat.value, delay]);

  return (
    <div className="group bg-espresso px-6 py-8 transition-colors duration-500 hover:bg-mocha">
      <p className="font-display text-[clamp(2.2rem,4vw,3.2rem)] leading-none text-gilt tabular-nums">
        {numberFmt(n)}
        {stat.suffix ?? ""}
      </p>
      <p className="label-xs mt-3 text-cream/75">{stat.label}</p>
      <p className="mt-2 text-[12.5px] leading-relaxed text-muted">{stat.note}</p>
    </div>
  );
}
