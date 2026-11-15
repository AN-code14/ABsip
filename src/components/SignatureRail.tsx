"use client";

import { useRef, useState } from "react";
import Link from "next/link";

import MenuCard from "@/components/MenuCard";
import ItemModal from "@/components/ItemModal";
import { ArrowRight } from "@/components/Icons";
import type { CardItem } from "@/lib/types";

export default function SignatureRail({ items }: { items: CardItem[] }) {
  const railRef = useRef<HTMLDivElement | null>(null);
  const [active, setActive] = useState<CardItem | null>(null);

  const scrollBy = (dir: 1 | -1) => {
    const el = railRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * Math.min(el.clientWidth * 0.8, 700), behavior: "smooth" });
  };

  return (
    <div>
      <div className="mb-7 flex items-center justify-end gap-3">
        <button
          type="button"
          onClick={() => scrollBy(-1)}
          aria-label="Scroll left"
          className="rounded-full border border-gold/25 p-2.5 text-cream/70 transition hover:border-gold hover:text-champagne"
        >
          <ArrowRight className="h-4 w-4 rotate-180" />
        </button>
        <button
          type="button"
          onClick={() => scrollBy(1)}
          aria-label="Scroll right"
          className="rounded-full border border-gold/25 p-2.5 text-cream/70 transition hover:border-gold hover:text-champagne"
        >
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>

      <div
        ref={railRef}
        className="-mx-5 flex snap-x snap-mandatory gap-5 overflow-x-auto px-5 pb-6 [scrollbar-width:none] sm:-mx-8 sm:px-8 [&::-webkit-scrollbar]:hidden"
      >
        {items.map((item) => (
          <MenuCard key={item.id} item={item} variant="rail" onOpen={setActive} />
        ))}
        <div className="flex w-[270px] shrink-0 snap-start items-center sm:w-[320px]">
          <Link
            href="/menu"
            className="group flex h-[330px] w-full flex-col items-center justify-center gap-4 rounded-xl border border-dashed border-gold/30 text-center transition hover:border-gold hover:bg-mocha/50"
          >
            <span className="label-xs text-gold">All 35 pours &amp; plates</span>
            <span className="font-display text-3xl text-cream transition group-hover:text-champagne">
              Open the menu
            </span>
            <ArrowRight className="h-6 w-6 text-gold transition-transform duration-500 group-hover:translate-x-2" />
          </Link>
        </div>
      </div>

      <ItemModal item={active} onClose={() => setActive(null)} />
    </div>
  );
}
