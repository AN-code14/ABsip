"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";

import Reveal from "@/components/Reveal";
import { ArrowRight, CloseIcon } from "@/components/Icons";

export type Shot = { src: string; title: string; caption: string; zone: string; span?: string };

export default function AmbienceWall({ shots }: { shots: Shot[] }) {
  const [index, setIndex] = useState<number | null>(null);

  const close = useCallback(() => setIndex(null), []);
  const step = useCallback(
    (dir: number) => setIndex((i) => (i === null ? null : (i + dir + shots.length) % shots.length)),
    [shots.length],
  );

  useEffect(() => {
    if (index === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [index, close, step]);

  const current = index === null ? null : shots[index];

  return (
    <>
      <div className="grid auto-rows-[190px] grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-12 lg:auto-rows-[210px]">
        {shots.map((s, i) => (
          <Reveal
            key={s.title}
            delay={i * 60}
            className={`col-span-1 ${s.span ?? "lg:col-span-4"} ${i % 5 === 0 ? "lg:row-span-1" : ""}`}
          >
            <button
              type="button"
              onClick={() => setIndex(i)}
              className="group relative block h-full w-full overflow-hidden rounded-xl border border-gold/12 text-left transition-all duration-500 hover:border-gold/45"
            >
              <Image
                src={s.src}
                alt={s.title}
                fill
                sizes="(max-width: 1024px) 50vw, 33vw"
                className="object-cover transition-transform duration-[1.6s] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/25 to-transparent opacity-90 transition-opacity duration-500 group-hover:opacity-70" />
              <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-5">
                <div>
                  <p className="label-xs text-gold/85">{s.zone}</p>
                  <h3 className="mt-1.5 font-display text-xl leading-tight text-cream">{s.title}</h3>
                </div>
                <ArrowRight className="h-5 w-5 shrink-0 -rotate-45 text-gold opacity-0 transition-all duration-500 group-hover:rotate-0 group-hover:opacity-100" />
              </div>
            </button>
          </Reveal>
        ))}
      </div>

      {current ? (
        <div className="fixed inset-0 z-[97] flex items-center justify-center p-4 sm:p-8" role="dialog" aria-modal="true" aria-label={current.title}>
          <div className="absolute inset-0 bg-ink/94 backdrop-blur-md" onClick={close} />
          <div className="animate-fade-up relative flex max-h-full w-full max-w-6xl flex-col overflow-hidden rounded-2xl border border-gold/25 bg-espresso lg:flex-row">
            <div className="relative h-[46vh] w-full shrink-0 lg:h-[70vh] lg:flex-1">
              <Image src={current.src} alt={current.title} fill sizes="90vw" className="object-cover" />
            </div>
            <div className="flex w-full flex-col justify-between p-7 lg:w-[340px]">
              <div>
                <p className="label-xs text-gold">{current.zone}</p>
                <h3 className="mt-3 font-display text-3xl leading-tight text-cream">{current.title}</h3>
                <p className="mt-4 text-[14px] leading-relaxed text-cream/60">{current.caption}</p>
              </div>
              <div className="mt-7 flex items-center justify-between gap-3">
                <span className="text-[11px] tracking-[0.2em] text-muted uppercase tabular-nums">
                  {(index ?? 0) + 1} / {shots.length}
                </span>
                <div className="flex gap-2">
                  <button type="button" onClick={() => step(-1)} aria-label="Previous" className="rounded-full border border-gold/25 p-2.5 text-cream/75 transition hover:border-gold hover:text-champagne">
                    <ArrowRight className="h-4 w-4 rotate-180" />
                  </button>
                  <button type="button" onClick={() => step(1)} aria-label="Next" className="rounded-full border border-gold/25 p-2.5 text-cream/75 transition hover:border-gold hover:text-champagne">
                    <ArrowRight className="h-4 w-4" />
                  </button>
                  <button type="button" onClick={close} aria-label="Close" className="rounded-full border border-gold/25 p-2.5 text-cream/75 transition hover:border-gold hover:text-champagne">
                    <CloseIcon className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
