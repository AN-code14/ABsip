"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { BagIcon, CloseIcon, MinusIcon, PlusIcon, TrayIcon } from "@/components/Icons";
import { inr } from "@/lib/money";

export type CartLine = {
  id: number;
  name: string;
  price: number;
  image: string;
  category: string;
  qty: number;
};

type Toast = { id: number; text: string; sub?: string };

type CartCtx = {
  lines: CartLine[];
  add: (item: Omit<CartLine, "qty">, qty?: number) => void;
  setQty: (id: number, qty: number) => void;
  remove: (id: number) => void;
  clear: () => void;
  count: number;
  subtotal: number;
  ready: boolean;
  open: boolean;
  setOpen: (v: boolean) => void;
  toast: (text: string, sub?: string) => void;
};

const Ctx = createContext<CartCtx | null>(null);
const STORAGE_KEY = "absip.tray.v1";

export function useCart() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useCart must be used inside <CartProvider>");
  return ctx;
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [ready, setReady] = useState(false);
  const [open, setOpen] = useState(false);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const toastId = useRef(0);
  const pathname = usePathname();

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as CartLine[];
        if (Array.isArray(parsed)) setLines(parsed.filter((l) => l && typeof l.id === "number"));
      }
    } catch {
      /* tray stays empty */
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
    } catch {
      /* storage unavailable */
    }
  }, [lines, ready]);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const toast = useCallback((text: string, sub?: string) => {
    toastId.current += 1;
    const id = toastId.current;
    setToasts((t) => [...t.slice(-2), { id, text, sub }]);
    window.setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3200);
  }, []);

  const add: CartCtx["add"] = useCallback(
    (item, qty = 1) => {
      setLines((prev) => {
        const found = prev.find((l) => l.id === item.id);
        if (found) return prev.map((l) => (l.id === item.id ? { ...l, qty: l.qty + qty } : l));
        return [...prev, { ...item, qty }];
      });
      toast(`${item.name} added to your tray`, inr(item.price * qty));
    },
    [toast],
  );

  const setQty = useCallback((id: number, qty: number) => {
    setLines((prev) =>
      qty <= 0 ? prev.filter((l) => l.id !== id) : prev.map((l) => (l.id === id ? { ...l, qty } : l)),
    );
  }, []);

  const remove = useCallback((id: number) => setLines((prev) => prev.filter((l) => l.id !== id)), []);
  const clear = useCallback(() => setLines([]), []);

  const count = useMemo(() => lines.reduce((n, l) => n + l.qty, 0), [lines]);
  const subtotal = useMemo(() => lines.reduce((n, l) => n + l.qty * l.price, 0), [lines]);

  const value = useMemo(
    () => ({ lines, add, setQty, remove, clear, count, subtotal, ready, open, setOpen, toast }),
    [lines, add, setQty, remove, clear, count, subtotal, ready, open, toast],
  );

  const freeFrom = 2500;
  const progress = Math.min(100, Math.round((subtotal / freeFrom) * 100));

  return (
    <Ctx.Provider value={value}>
      {children}

      {/* floating tray button */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={`Open tray, ${count} items`}
        className={`fixed right-4 bottom-4 z-[92] flex items-center gap-3 rounded-full bg-cream px-4 py-3 text-ink shadow-[0_20px_45px_-18px_rgba(0,0,0,0.9)] ring-1 ring-gold/40 transition-all duration-500 hover:bg-champagne ${
          count > 0 ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-6 opacity-0"
        }`}
      >
        <BagIcon className="h-5 w-5" />
        <span className="text-[11px] font-semibold tracking-[0.18em] uppercase">
          Tray · {count}
        </span>
        <span className="font-display text-sm tabular-nums">{inr(subtotal)}</span>
      </button>

      {/* toasts */}
      <div className="pointer-events-none fixed right-4 bottom-24 z-[93] flex w-[min(20rem,calc(100vw-2rem))] flex-col gap-2">
        {toasts.map((t) => (
          <div
            key={t.id}
            className="animate-fade-up rounded-xl border border-gold/25 bg-espresso/95 px-4 py-3 shadow-2xl backdrop-blur"
          >
            <p className="text-[13px] leading-tight font-medium text-cream">{t.text}</p>
            {t.sub ? <p className="label-xs mt-1 text-gold">{t.sub}</p> : null}
          </div>
        ))}
      </div>

      {/* drawer */}
      <div
        className={`fixed inset-0 z-[94] transition-opacity duration-500 ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        aria-hidden={!open}
      >
        <div className="absolute inset-0 bg-ink/80 backdrop-blur-sm" onClick={() => setOpen(false)} />
        <aside
          className={`absolute top-0 right-0 flex h-full w-[min(27rem,100vw)] flex-col border-l border-gold/20 bg-espresso transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
            open ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <header className="flex items-center justify-between border-b border-gold/15 px-6 py-5">
            <div>
              <p className="label-xs text-gold">Your tray</p>
              <h2 className="font-display text-2xl text-cream">
                {count} {count === 1 ? "item" : "items"}
              </h2>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close tray"
              className="rounded-full border border-gold/25 p-2 text-cream/70 transition hover:border-gold hover:text-champagne"
            >
              <CloseIcon className="h-4 w-4" />
            </button>
          </header>

          <div className="flex-1 overflow-y-auto px-6 py-5">
            {lines.length === 0 ? (
              <div className="flex h-full flex-col items-center justify-center gap-4 text-center">
                <TrayIcon className="h-12 w-12 text-gold/40" />
                <p className="max-w-[16rem] text-sm text-cream/55">
                  Nothing on the tray yet. Add a cortado from the menu, or a slice of the tiramisu
                  noir — the kitchen plates both to order.
                </p>
                <Link
                  href="/menu"
                  onClick={() => setOpen(false)}
                  className="label-xs border-b border-gold/50 pb-1 text-gold transition hover:text-champagne"
                >
                  Browse the menu
                </Link>
              </div>
            ) : (
              <ul className="space-y-5">
                {lines.map((l) => (
                  <li key={l.id} className="flex gap-4">
                    <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg ring-1 ring-gold/20">
                      <Image src={l.image} alt={l.name} fill sizes="80px" className="object-cover" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-display text-[15px] leading-snug text-cream">{l.name}</p>
                      <p className="label-xs mt-1 text-muted">{l.category}</p>
                      <div className="mt-2 flex items-center justify-between">
                        <div className="flex items-center gap-3 rounded-full border border-gold/25 px-2 py-1">
                          <button
                            type="button"
                            aria-label={`Reduce ${l.name}`}
                            onClick={() => setQty(l.id, l.qty - 1)}
                            className="text-cream/70 transition hover:text-champagne"
                          >
                            <MinusIcon className="h-3.5 w-3.5" />
                          </button>
                          <span className="w-4 text-center text-sm tabular-nums">{l.qty}</span>
                          <button
                            type="button"
                            aria-label={`Add another ${l.name}`}
                            onClick={() => setQty(l.id, l.qty + 1)}
                            className="text-cream/70 transition hover:text-champagne"
                          >
                            <PlusIcon className="h-3.5 w-3.5" />
                          </button>
                        </div>
                        <span className="font-display text-sm text-champagne tabular-nums">
                          {inr(l.price * l.qty)}
                        </span>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {lines.length > 0 ? (
            <footer className="border-t border-gold/15 px-6 py-5">
              <div className="mb-3">
                <div className="mb-1.5 flex items-center justify-between text-[11px] text-cream/60">
                  <span className="tracking-[0.16em] uppercase">Complimentary delivery</span>
                  <span className="tabular-nums">{progress}%</span>
                </div>
                <div className="h-[3px] w-full overflow-hidden rounded-full bg-smoke">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-brass to-champagne transition-[width] duration-700"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <p className="mt-1.5 text-[11px] text-muted">
                  {subtotal >= freeFrom
                    ? "Unlocked — delivery is on the house."
                    : `Add ${inr(freeFrom - subtotal)} more for complimentary concierge delivery.`}
                </p>
              </div>
              <div className="flex items-baseline justify-between border-t border-gold/15 pt-3">
                <span className="label-xs text-muted">Subtotal</span>
                <span className="font-display text-xl text-cream tabular-nums">{inr(subtotal)}</span>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={clear}
                  className="label-xs rounded-full border border-gold/25 py-3 text-cream/70 transition hover:border-oxblood hover:text-cream"
                >
                  Empty tray
                </button>
                <Link
                  href="/order"
                  onClick={() => setOpen(false)}
                  className="label-xs rounded-full bg-gold py-3 text-center text-ink transition hover:bg-champagne"
                >
                  Complete order
                </Link>
              </div>
            </footer>
          ) : null}
        </aside>
      </div>
    </Ctx.Provider>
  );
}
