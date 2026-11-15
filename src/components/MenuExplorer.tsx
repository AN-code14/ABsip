"use client";

import { useEffect, useMemo, useState } from "react";

import MenuCard from "@/components/MenuCard";
import ItemModal from "@/components/ItemModal";
import Reveal from "@/components/Reveal";
import { BeanIcon, LeafIcon, SearchIcon, SparkIcon, TrayIcon } from "@/components/Icons";
import { useCart } from "@/components/cart/CartProvider";
import { inr } from "@/lib/money";
import type { CardItem } from "@/lib/types";

type Sort = "house" | "low" | "high" | "fast";

export default function MenuExplorer({ items, categories }: { items: CardItem[]; categories: string[] }) {
  const [category, setCategory] = useState("All");
  const [query, setQuery] = useState("");
  const [vegOnly, setVegOnly] = useState(false);
  const [signatureOnly, setSignatureOnly] = useState(false);
  const [sort, setSort] = useState<Sort>("house");
  const [list, setList] = useState(false);
  const [active, setActive] = useState<CardItem | null>(null);
  const [syncing, setSyncing] = useState(false);
  const [syncNote, setSyncNote] = useState("");
  const { add, count, subtotal, setOpen, toast } = useCart();

  const counts = useMemo(() => {
    const map = new Map<string, number>();
    items.forEach((i) => map.set(i.category, (map.get(i.category) ?? 0) + 1));
    return map;
  }, [items]);

  const filtered = useMemo(() => {
    let out = items.filter((i) => (category === "All" ? true : i.category === category));
    if (vegOnly) out = out.filter((i) => i.isVeg);
    if (signatureOnly) out = out.filter((i) => i.isSignature);
    const q = query.trim().toLowerCase();
    if (q) {
      out = out.filter(
        (i) =>
          i.name.toLowerCase().includes(q) ||
          i.description.toLowerCase().includes(q) ||
          i.category.toLowerCase().includes(q) ||
          (i.origin ?? "").toLowerCase().includes(q) ||
          i.tags.some((t) => t.toLowerCase().includes(q)),
      );
    }
    const sorted = [...out];
    if (sort === "low") sorted.sort((a, b) => a.price - b.price);
    if (sort === "high") sorted.sort((a, b) => b.price - a.price);
    if (sort === "fast") sorted.sort((a, b) => a.prepMinutes - b.prepMinutes);
    return sorted;
  }, [items, category, vegOnly, signatureOnly, query, sort]);

  useEffect(() => {
    document.body.style.overflow = "";
  }, []);

  async function syncWithKitchen() {
    setSyncing(true);
    setSyncNote("");
    try {
      const res = await fetch("/api/menu");
      const data = (await res.json()) as { ok?: boolean; items?: unknown[] };
      if (!res.ok || !data.ok) throw new Error("Kitchen offline");
      toast(`Menu synced — ${data.items?.length ?? 0} items live`, "Prices checked with the pass");
      setSyncNote(`Synced ${data.items?.length ?? 0} items with the kitchen just now.`);
    } catch {
      toast("Couldn't reach the kitchen", "Showing the last printed card");
      setSyncNote("The kitchen line is busy — showing the printed card.");
    } finally {
      setSyncing(false);
    }
  }

  const cheapest = filtered.length ? Math.min(...filtered.map((f) => f.price)) : 0;
  const dearest = filtered.length ? Math.max(...filtered.map((f) => f.price)) : 0;

  return (
    <div>
      {/* control bar */}
      <div className="sticky top-[68px] z-40 -mx-5 border-y border-gold/12 bg-ink/92 px-5 py-4 backdrop-blur-xl sm:-mx-8 sm:px-8">
        <div className="flex flex-col gap-4">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex min-w-[220px] flex-1 items-center gap-2.5 rounded-full border border-gold/20 bg-espresso px-4 py-2.5 transition focus-within:border-gold/60">
              <SearchIcon className="h-4 w-4 shrink-0 text-gold/70" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search geisha, truffle, saffron…"
                aria-label="Search the menu"
                className="w-full bg-transparent text-[13.5px] text-cream placeholder:text-muted/60 focus:outline-none"
              />
              {query ? (
                <button
                  type="button"
                  onClick={() => setQuery("")}
                  className="text-[10px] tracking-[0.16em] text-muted uppercase hover:text-champagne"
                >
                  Clear
                </button>
              ) : null}
            </div>

            <div className="flex items-center gap-2">
              <Toggle on={vegOnly} onClick={() => setVegOnly((v) => !v)} icon={<LeafIcon className="h-3.5 w-3.5" />} label="Veg only" />
              <Toggle on={signatureOnly} onClick={() => setSignatureOnly((v) => !v)} icon={<SparkIcon className="h-3.5 w-3.5" />} label="Signatures" />
              <button
                type="button"
                onClick={syncWithKitchen}
                disabled={syncing}
                className="flex items-center gap-2 rounded-full border border-gold/20 px-3.5 py-2 text-[10px] tracking-[0.16em] text-cream/65 uppercase transition hover:border-gold/60 hover:text-champagne disabled:opacity-50"
              >
                <BeanIcon className={`h-3.5 w-3.5 text-gold/70 ${syncing ? "animate-spin" : ""}`} />
                {syncing ? "Syncing" : "Sync"}
              </button>
              <button
                type="button"
                onClick={() => setList((l) => !l)}
                className="rounded-full border border-gold/20 px-3.5 py-2 text-[10px] tracking-[0.16em] text-cream/65 uppercase transition hover:border-gold/60 hover:text-champagne"
              >
                {list ? "Grid" : "List"}
              </button>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {["All", ...categories].map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setCategory(c)}
                className={`rounded-full border px-4 py-2 text-[10.5px] tracking-[0.16em] uppercase transition-all duration-300 ${
                  category === c
                    ? "border-gold bg-gold text-ink"
                    : "border-gold/18 text-cream/60 hover:border-gold/50 hover:text-cream"
                }`}
              >
                {c}
                <span className={`ml-2 tabular-nums ${category === c ? "text-ink/60" : "text-muted"}`}>
                  {c === "All" ? items.length : counts.get(c) ?? 0}
                </span>
              </button>
            ))}

            <div className="ml-auto flex items-center gap-3">
              <label className="flex items-center gap-2 text-[10px] tracking-[0.16em] text-muted uppercase">
                Sort
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value as Sort)}
                  className="rounded-full border border-gold/20 bg-espresso px-3 py-2 text-[10.5px] tracking-[0.12em] text-cream uppercase focus:border-gold focus:outline-none"
                >
                  <option value="house">House order</option>
                  <option value="low">Price · low to high</option>
                  <option value="high">Price · high to low</option>
                  <option value="fast">Fastest to table</option>
                </select>
              </label>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-x-5 gap-y-1 text-[11px] text-muted">
            <span className="tracking-[0.14em] uppercase">
              {filtered.length} {filtered.length === 1 ? "item" : "items"}
            </span>
            {filtered.length ? (
              <span className="tabular-nums">
                {inr(cheapest)} — {inr(dearest)}
              </span>
            ) : null}
            {syncNote ? <span className="text-gold/70 italic">{syncNote}</span> : null}
            {count > 0 ? (
              <button
                type="button"
                onClick={() => setOpen(true)}
                className="ml-auto flex items-center gap-2 rounded-full bg-gold/15 px-3.5 py-1.5 text-[10px] tracking-[0.16em] text-champagne uppercase transition hover:bg-gold/25"
              >
                <TrayIcon className="h-3.5 w-3.5" /> {count} on tray · {inr(subtotal)}
              </button>
            ) : null}
          </div>
        </div>
      </div>

      {/* results */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center gap-4 py-24 text-center">
          <BeanIcon className="h-12 w-12 text-gold/30" />
          <p className="font-display text-2xl text-cream">Nothing matches that.</p>
          <p className="max-w-sm text-sm text-cream/55">
            Try “geisha”, “truffle” or “saffron” — or clear the filters and browse the whole card.
          </p>
          <button
            type="button"
            onClick={() => {
              setQuery("");
              setCategory("All");
              setVegOnly(false);
              setSignatureOnly(false);
            }}
            className="label-xs rounded-full border border-gold/40 px-5 py-2.5 text-gold transition hover:bg-gold hover:text-ink"
          >
            Reset filters
          </button>
        </div>
      ) : (
        <div className={list ? "mt-10 space-y-4" : "mt-10 grid gap-5 sm:grid-cols-2 xl:grid-cols-3"}>
          {filtered.map((item, i) => (
            <Reveal key={item.id} delay={Math.min(i, 8) * 55}>
              <MenuCard item={item} variant={list ? "wide" : "grid"} onOpen={setActive} />
            </Reveal>
          ))}
        </div>
      )}

      {/* add-all signature flight */}
      <Reveal>
        <div className="mt-14 flex flex-col items-start justify-between gap-6 rounded-2xl border border-gold/20 bg-mocha/50 p-7 sm:flex-row sm:items-center">
          <div>
            <p className="label-xs text-gold">Can't decide</p>
            <h3 className="mt-2 font-display text-2xl text-cream">
              Add the signature flight to your tray
            </h3>
            <p className="mt-2 max-w-lg text-[13.5px] leading-relaxed text-cream/55">
              Every house signature on this card, one of each — {items.filter((i) => i.isSignature).length} plates
              and pours, {inr(items.filter((i) => i.isSignature).reduce((n, i) => n + i.price, 0))} total.
            </p>
          </div>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => {
                items
                  .filter((i) => i.isSignature)
                  .forEach((i) =>
                    add({ id: i.id, name: i.name, price: i.price, image: i.image, category: i.category }),
                  );
                toast("Signature flight added", `${items.filter((i) => i.isSignature).length} items on the tray`);
              }}
              className="rounded-full bg-gold px-6 py-3.5 text-[10.5px] font-semibold tracking-[0.2em] text-ink uppercase transition hover:bg-champagne"
            >
              Add the flight
            </button>
            <button
              type="button"
              onClick={syncWithKitchen}
              className="rounded-full border border-gold/30 px-6 py-3.5 text-[10.5px] font-semibold tracking-[0.2em] text-cream uppercase transition hover:border-gold hover:bg-gold/10"
            >
              Re-sync prices
            </button>
          </div>
        </div>
      </Reveal>

      <ItemModal item={active} onClose={() => setActive(null)} />
    </div>
  );
}

function Toggle({
  on,
  onClick,
  icon,
  label,
}: {
  on: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={on}
      className={`flex items-center gap-2 rounded-full border px-3.5 py-2 text-[10px] tracking-[0.16em] uppercase transition ${
        on ? "border-gold bg-gold/15 text-champagne" : "border-gold/20 text-cream/60 hover:border-gold/50 hover:text-cream"
      }`}
    >
      <span className={on ? "text-gold" : "text-gold/60"}>{icon}</span>
      {label}
    </button>
  );
}


