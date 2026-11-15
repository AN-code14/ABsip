"use client";

import { useEffect, useState } from "react";

import { openState } from "@/lib/time";

export default function OpenStatusPill({ compact = false }: { compact?: boolean }) {
  const [state, setState] = useState(() => openState());
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setState(openState());
    const t = window.setInterval(() => setState(openState()), 30_000);
    return () => window.clearInterval(t);
  }, []);

  const s = mounted ? state : openState();

  return (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
      <span className="flex items-center gap-2 rounded-full border border-gold/25 bg-ink/60 px-3 py-1.5 backdrop-blur">
        <span className="relative flex h-1.5 w-1.5">
          <span
            className={`absolute inline-flex h-full w-full animate-ping rounded-full opacity-70 ${
              s.isOpen ? "bg-sage" : "bg-oxblood"
            }`}
          />
          <span
            className={`relative inline-flex h-1.5 w-1.5 rounded-full ${s.isOpen ? "bg-sage" : "bg-oxblood"}`}
          />
        </span>
        <span className="text-[10px] font-medium tracking-[0.24em] text-cream uppercase">
          {s.label}
        </span>
      </span>
      {!compact ? (
        <span className="text-[11px] tracking-[0.08em] text-muted tabular-nums">{s.detail}</span>
      ) : null}
    </div>
  );
}
