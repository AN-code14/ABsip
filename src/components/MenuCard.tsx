"use client";

import Image from "next/image";

import { BeanIcon, ClockIcon, LeafIcon, PlusIcon, SparkIcon } from "@/components/Icons";
import { useCart } from "@/components/cart/CartProvider";
import { inr } from "@/lib/money";
import type { CardItem } from "@/lib/types";

export default function MenuCard({
  item,
  variant = "grid",
  onOpen,
}: {
  item: CardItem;
  variant?: "grid" | "rail" | "wide";
  onOpen?: (item: CardItem) => void;
}) {
  const { add } = useCart();

  const quickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    add({
      id: item.id,
      name: item.name,
      price: item.price,
      image: item.image,
      category: item.category,
    });
  };

  if (variant === "wide") {
    return (
      <article
        onClick={() => onOpen?.(item)}
        className="group sheen relative flex cursor-pointer flex-col overflow-hidden rounded-xl border border-gold/12 bg-mocha/70 transition-all duration-500 hover:border-gold/40 hover:bg-mocha sm:flex-row"
      >
        <div className="relative h-52 w-full shrink-0 overflow-hidden sm:h-auto sm:w-56">
          <Image
            src={item.image}
            alt={item.name}
            fill
            sizes="(max-width: 640px) 100vw, 224px"
            className="object-cover transition-transform duration-[1.2s] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-transparent sm:bg-gradient-to-r" />
        </div>
        <div className="flex flex-1 flex-col p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="label-xs text-gold/80">{item.category}</p>
              <h3 className="mt-2 font-display text-2xl leading-tight text-cream">{item.name}</h3>
            </div>
            <p className="font-display text-xl whitespace-nowrap text-champagne tabular-nums">
              {inr(item.price)}
            </p>
          </div>
          <p className="mt-3 text-[14px] leading-relaxed text-cream/55">{item.description}</p>
          <div className="mt-auto flex flex-wrap items-center gap-2 pt-5">
            {item.isSignature ? <Chip icon={<SparkIcon className="h-3 w-3" />} label="Signature" gold /> : null}
            {item.isVeg ? <Chip icon={<LeafIcon className="h-3 w-3" />} label="Vegetarian" /> : null}
            <Chip icon={<ClockIcon className="h-3 w-3" />} label={`${item.prepMinutes} min`} />
            <button
              type="button"
              onClick={quickAdd}
              className="ml-auto flex items-center gap-2 rounded-full bg-gold px-4 py-2 text-[10.5px] font-semibold tracking-[0.2em] text-ink uppercase transition hover:bg-champagne"
            >
              <PlusIcon className="h-3.5 w-3.5" /> Add
            </button>
          </div>
        </div>
      </article>
    );
  }

  if (variant === "rail") {
    return (
      <article className="group relative w-[270px] shrink-0 snap-start sm:w-[320px]">
        <div className="relative h-[330px] overflow-hidden rounded-xl border border-gold/12 bg-mocha">
          <Image
            src={item.image}
            alt={item.name}
            fill
            sizes="(max-width: 640px) 80vw, 320px"
            className="object-cover transition-transform duration-[1.4s] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.12]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/25 to-transparent" />
          {item.isSignature ? (
            <span className="absolute top-3 left-3 flex items-center gap-1.5 rounded-full bg-ink/80 px-2.5 py-1 text-[9px] tracking-[0.2em] text-champagne uppercase backdrop-blur">
              <SparkIcon className="h-3 w-3" /> Signature
            </span>
          ) : null}
          <button
            type="button"
            onClick={() => onOpen?.(item)}
            className="absolute inset-x-3 bottom-3 rounded-lg border border-gold/25 bg-ink/75 px-4 py-3 text-left backdrop-blur transition hover:border-gold/70 hover:bg-ink/90"
          >
            <p className="label-xs text-gold/80">{item.category}</p>
            <h3 className="mt-1.5 font-display text-lg leading-snug text-cream">{item.name}</h3>
            <div className="mt-2 flex items-center justify-between">
              <span className="font-display text-base text-champagne tabular-nums">{inr(item.price)}</span>
              <span
                role="button"
                tabIndex={0}
                onClick={quickAdd}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    e.stopPropagation();
                    add({
                      id: item.id,
                      name: item.name,
                      price: item.price,
                      image: item.image,
                      category: item.category,
                    });
                  }
                }}
                className="flex items-center gap-1.5 rounded-full bg-gold px-3 py-1.5 text-[9.5px] font-semibold tracking-[0.16em] text-ink uppercase transition hover:bg-champagne"
              >
                <PlusIcon className="h-3 w-3" /> Add
              </span>
            </div>
          </button>
        </div>
      </article>
    );
  }

  return (
    <article
      onClick={() => onOpen?.(item)}
      className="group sheen relative flex cursor-pointer flex-col overflow-hidden rounded-xl border border-gold/12 bg-mocha/60 transition-all duration-500 hover:-translate-y-1 hover:border-gold/40 hover:bg-mocha"
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image
          src={item.image}
          alt={item.name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transition-transform duration-[1.3s] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.1]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-mocha via-mocha/10 to-transparent" />
        <div className="absolute top-3 right-3 flex items-center gap-1.5 rounded-full bg-ink/80 px-2.5 py-1 backdrop-blur">
          <span
            className={`h-1.5 w-1.5 rounded-full ${item.isVeg ? "bg-sage" : "bg-oxblood"}`}
            aria-hidden
          />
          <span className="text-[9px] tracking-[0.18em] text-cream/70 uppercase">
            {item.isVeg ? "Veg" : "Non-veg"}
          </span>
        </div>
        {item.isSignature ? (
          <span className="absolute top-3 left-3 flex items-center gap-1.5 rounded-full bg-gold/90 px-2.5 py-1 text-[9px] font-semibold tracking-[0.18em] text-ink uppercase">
            <SparkIcon className="h-3 w-3" /> Signature
          </span>
        ) : null}
      </div>

      <div className="flex flex-1 flex-col p-5">
        <p className="label-xs text-gold/75">{item.category}</p>
        <h3 className="mt-2 font-display text-[22px] leading-tight text-cream transition group-hover:text-champagne">
          {item.name}
        </h3>
        <p className="mt-2.5 line-clamp-3 text-[13.5px] leading-relaxed text-cream/50">
          {item.description}
        </p>

        <div className="mt-4 flex items-center gap-2 text-[10.5px] text-muted">
          <ClockIcon className="h-3.5 w-3.5 text-gold/60" />
          <span className="tabular-nums">{item.prepMinutes} min</span>
          {item.kcal ? (
            <>
              <span className="text-gold/30">·</span>
              <span className="tabular-nums">{item.kcal} kcal</span>
            </>
          ) : null}
          {item.origin ? (
            <>
              <span className="text-gold/30">·</span>
              <BeanIcon className="h-3.5 w-3.5 text-gold/60" />
              <span className="truncate">{item.origin}</span>
            </>
          ) : null}
        </div>

        <div className="mt-5 flex items-center justify-between border-t border-gold/12 pt-4">
          <span className="font-display text-xl text-champagne tabular-nums">{inr(item.price)}</span>
          <button
            type="button"
            onClick={quickAdd}
            className="flex items-center gap-1.5 rounded-full border border-gold/35 px-3.5 py-2 text-[10px] font-semibold tracking-[0.18em] text-cream uppercase transition hover:border-gold hover:bg-gold hover:text-ink"
          >
            <PlusIcon className="h-3.5 w-3.5" /> Add
          </button>
        </div>
      </div>
    </article>
  );
}

function Chip({ icon, label, gold }: { icon: React.ReactNode; label: string; gold?: boolean }) {
  return (
    <span
      className={`flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[9.5px] tracking-[0.16em] uppercase ${
        gold ? "border-gold/40 text-champagne" : "border-gold/15 text-cream/55"
      }`}
    >
      {icon}
      {label}
    </span>
  );
}
