"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

import { BeanIcon, ClockIcon, CloseIcon, FlameIcon, LeafIcon, MinusIcon, PlusIcon, SparkIcon, TrayIcon } from "@/components/Icons";
import { useCart } from "@/components/cart/CartProvider";
import { inr } from "@/lib/money";
import type { CardItem } from "@/lib/types";

export default function ItemModal({ item, onClose }: { item: CardItem | null; onClose: () => void }) {
  const { add, setOpen } = useCart();
  const [qty, setQty] = useState(1);

  useEffect(() => setQty(1), [item]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (item) {
      document.addEventListener("keydown", onKey);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [item, onClose]);

  if (!item) return null;

  return (
    <div className="fixed inset-0 z-[96] flex items-end justify-center p-0 sm:items-center sm:p-6" role="dialog" aria-modal="true" aria-label={item.name}>
      <div className="absolute inset-0 bg-ink/85 backdrop-blur-md" onClick={onClose} />
      <div className="animate-fade-up relative flex max-h-[92vh] w-full max-w-4xl flex-col overflow-hidden rounded-t-2xl border border-gold/25 bg-espresso sm:rounded-2xl md:flex-row">
        <div className="relative h-56 w-full shrink-0 md:h-auto md:w-[46%]">
          <Image src={item.image} alt={item.name} fill sizes="(max-width: 768px) 100vw, 46vw" className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-espresso via-espresso/10 to-transparent md:bg-gradient-to-r" />
          {item.isSignature ? (
            <span className="absolute top-4 left-4 flex items-center gap-1.5 rounded-full bg-gold px-3 py-1.5 text-[9.5px] font-semibold tracking-[0.2em] text-ink uppercase">
              <SparkIcon className="h-3 w-3" /> House signature
            </span>
          ) : null}
        </div>

        <div className="flex-1 overflow-y-auto p-6 sm:p-8">
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="absolute top-4 right-4 rounded-full border border-gold/25 bg-ink/60 p-2 text-cream/70 transition hover:border-gold hover:text-champagne"
          >
            <CloseIcon className="h-4 w-4" />
          </button>

          <p className="label-xs text-gold">{item.category}</p>
          <h2 className="mt-3 font-display text-[clamp(1.7rem,3.4vw,2.5rem)] leading-[1.05] text-cream">
            {item.name}
          </h2>

          <div className="mt-4 flex flex-wrap items-center gap-2">
            <Meta icon={<LeafIcon className="h-3.5 w-3.5" />} label={item.isVeg ? "Vegetarian" : "Non-vegetarian"} />
            <Meta icon={<ClockIcon className="h-3.5 w-3.5" />} label={`${item.prepMinutes} min to table`} />
            {item.kcal ? <Meta icon={<FlameIcon className="h-3.5 w-3.5" />} label={`${item.kcal} kcal`} /> : null}
            {item.origin ? <Meta icon={<BeanIcon className="h-3.5 w-3.5" />} label={item.origin} /> : null}
          </div>

          <p className="mt-5 text-[15px] leading-relaxed text-cream/70">{item.description}</p>

          {item.story ? (
            <blockquote className="mt-5 border-l border-gold/40 pl-4 font-display text-[15px] leading-relaxed text-parchment/80 italic">
              {item.story}
            </blockquote>
          ) : null}

          {item.pairing ? (
            <p className="mt-5 text-[13px] text-cream/55">
              <span className="label-xs text-gold/80">Sommelier pairing</span>
              <br />
              {item.pairing}
            </p>
          ) : null}

          <div className="mt-7 flex flex-wrap items-center gap-3 border-t border-gold/15 pt-6">
            <span className="font-display text-3xl text-champagne tabular-nums">{inr(item.price * qty)}</span>
            <div className="flex items-center gap-3 rounded-full border border-gold/25 px-3 py-2">
              <button type="button" aria-label="Fewer" onClick={() => setQty((q) => Math.max(1, q - 1))} className="text-cream/70 hover:text-champagne">
                <MinusIcon className="h-3.5 w-3.5" />
              </button>
              <span className="w-5 text-center tabular-nums">{qty}</span>
              <button type="button" aria-label="More" onClick={() => setQty((q) => Math.min(12, q + 1))} className="text-cream/70 hover:text-champagne">
                <PlusIcon className="h-3.5 w-3.5" />
              </button>
            </div>
            <button
              type="button"
              onClick={() => {
                add(
                  { id: item.id, name: item.name, price: item.price, image: item.image, category: item.category },
                  qty,
                );
                onClose();
                setOpen(true);
              }}
              className="sheen ml-auto flex items-center gap-2 rounded-full bg-gold px-6 py-3 text-[10.5px] font-semibold tracking-[0.2em] text-ink uppercase transition hover:bg-champagne"
            >
              <TrayIcon className="h-4 w-4" /> Add to tray
            </button>
          </div>

          <Link
            href="/book"
            onClick={onClose}
            className="mt-4 inline-block text-[11px] tracking-[0.2em] text-cream/50 uppercase transition hover:text-champagne"
          >
            Or reserve a table and have it plated →
          </Link>
        </div>
      </div>
    </div>
  );
}

function Meta({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <span className="flex items-center gap-1.5 rounded-full border border-gold/15 px-2.5 py-1 text-[9.5px] tracking-[0.14em] text-cream/60 uppercase">
      <span className="text-gold/70">{icon}</span>
      {label}
    </span>
  );
}
