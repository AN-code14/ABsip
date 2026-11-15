"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { BagIcon, BarsIcon, BeanIcon, CloseIcon, PhoneIcon } from "@/components/Icons";
import { useCart } from "@/components/cart/CartProvider";
import { CAFE, waLink } from "@/lib/site";
import { openState } from "@/lib/time";

const LINKS = [
  { href: "/", label: "Home" },
  { href: "/menu", label: "Menu" },
  { href: "/ambience", label: "Ambience" },
  { href: "/order", label: "Order" },
  { href: "/track", label: "Track" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [progress, setProgress] = useState(0);
  const [drawer, setDrawer] = useState(false);
  const [status, setStatus] = useState(() => openState());
  const pathname = usePathname();
  const { count, setOpen } = useCart();

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 36);
      const h = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(h > 0 ? Math.min(100, (y / h) * 100) : 0);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const t = window.setInterval(() => setStatus(openState()), 60_000);
    return () => window.clearInterval(t);
  }, []);

  useEffect(() => {
    setDrawer(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = drawer ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [drawer]);

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-[80] transition-all duration-500 ${
          scrolled
            ? "border-b border-gold/15 bg-ink/88 backdrop-blur-xl"
            : "border-b border-transparent bg-gradient-to-b from-ink/85 to-transparent"
        }`}
      >
        <div className="mx-auto flex h-[68px] max-w-[1400px] items-center gap-6 px-5 sm:px-8">
          <Link href="/" className="group flex items-baseline gap-2.5" aria-label="ABsip home">
            <BeanIcon className="h-5 w-5 self-center text-gold transition-transform duration-700 group-hover:rotate-[24deg]" />
            <span className="font-display text-[26px] leading-none font-medium tracking-[0.06em] text-cream">
              AB<span className="text-gilt italic">sip</span>
            </span>
            <span className="hidden text-[8.5px] tracking-[0.34em] text-muted uppercase lg:inline">
              Est. {CAFE.established}
            </span>
          </Link>

          <nav className="mx-auto hidden items-center gap-8 lg:flex">
            {LINKS.map((l) => {
              const active = pathname === l.href;
              return (
                <Link
                  key={l.href}
                  href={l.href}
                  className={`relative text-[11px] font-medium tracking-[0.26em] uppercase transition-colors ${
                    active ? "text-champagne" : "text-cream/70 hover:text-cream"
                  }`}
                >
                  {l.label}
                  <span
                    className={`absolute -bottom-1.5 left-0 h-px bg-gold transition-all duration-500 ${
                      active ? "w-full" : "w-0 group-hover:w-full"
                    }`}
                  />
                </Link>
              );
            })}
          </nav>

          <div className="ml-auto flex items-center gap-2.5 lg:ml-0">
            <span className="hidden items-center gap-2 rounded-full border border-gold/20 px-3 py-1.5 xl:flex">
              <span className="relative flex h-1.5 w-1.5">
                <span
                  className={`absolute inline-flex h-full w-full animate-ping rounded-full opacity-70 ${
                    status.isOpen ? "bg-sage" : "bg-oxblood"
                  }`}
                />
                <span
                  className={`relative inline-flex h-1.5 w-1.5 rounded-full ${
                    status.isOpen ? "bg-sage" : "bg-oxblood"
                  }`}
                />
              </span>
              <span className="text-[9.5px] tracking-[0.24em] text-cream/70 uppercase">
                {status.label}
              </span>
            </span>

            <a
              href={waLink("Hello ABsip, I'd like to speak to the concierge.")}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="WhatsApp the concierge"
              className="hidden rounded-full border border-gold/25 p-2.5 text-cream/75 transition hover:border-gold hover:text-champagne md:block"
            >
              <PhoneIcon className="h-4 w-4" />
            </a>

            <button
              type="button"
              onClick={() => setOpen(true)}
              aria-label="Open tray"
              className="relative rounded-full border border-gold/25 p-2.5 text-cream/80 transition hover:border-gold hover:text-champagne"
            >
              <BagIcon className="h-4 w-4" />
              {count > 0 ? (
                <span className="absolute -top-1 -right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-gold px-1 text-[9px] font-bold text-ink tabular-nums">
                  {count}
                </span>
              ) : null}
            </button>

            <Link
              href="/book"
              className="sheen hidden rounded-full bg-gold px-5 py-2.5 text-[10.5px] font-semibold tracking-[0.22em] text-ink uppercase transition hover:bg-champagne sm:block"
            >
              Reserve a table
            </Link>

            <button
              type="button"
              onClick={() => setDrawer(true)}
              aria-label="Open menu"
              className="rounded-full border border-gold/25 p-2.5 text-cream/80 lg:hidden"
            >
              <BarsIcon className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div
          className="h-px bg-gradient-to-r from-brass via-champagne to-brass transition-[width] duration-200"
          style={{ width: `${progress}%` }}
        />
      </header>

      {/* mobile drawer */}
      <div
        className={`fixed inset-0 z-[85] lg:hidden ${drawer ? "" : "pointer-events-none"}`}
        aria-hidden={!drawer}
      >
        <div
          className={`absolute inset-0 bg-ink/90 backdrop-blur-md transition-opacity duration-500 ${
            drawer ? "opacity-100" : "opacity-0"
          }`}
          onClick={() => setDrawer(false)}
        />
        <div
          className={`absolute inset-y-0 right-0 flex w-[min(23rem,90vw)] flex-col border-l border-gold/20 bg-espresso px-7 py-6 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
            drawer ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="font-display text-2xl">
              AB<span className="text-gilt italic">sip</span>
            </span>
            <button
              type="button"
              onClick={() => setDrawer(false)}
              aria-label="Close menu"
              className="rounded-full border border-gold/25 p-2 text-cream/70"
            >
              <CloseIcon className="h-4 w-4" />
            </button>
          </div>

          <nav className="mt-10 flex flex-col gap-1">
            {[...LINKS, { href: "/book", label: "Reserve" }, { href: "/dashboard", label: "Concierge desk" }].map(
              (l, i) => (
                <Link
                  key={l.href}
                  href={l.href}
                  className="group flex items-baseline justify-between border-b border-gold/10 py-4 transition hover:border-gold/40"
                >
                  <span className="font-display text-[28px] text-cream transition group-hover:text-champagne">
                    {l.label}
                  </span>
                  <span className="label-xs text-muted">0{i + 1}</span>
                </Link>
              ),
            )}
          </nav>

          <div className="mt-auto space-y-3 pt-8">
            <p className="text-[11px] tracking-[0.2em] text-gold uppercase">{status.label}</p>
            <p className="text-sm leading-relaxed text-cream/60">{CAFE.addressLine1}</p>
            <p className="text-sm leading-relaxed text-cream/60">{CAFE.addressLine2}</p>
            <a
              href={waLink("Hello ABsip, I'd like to reserve a table.")}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 flex items-center justify-center gap-2 rounded-full bg-gold px-5 py-3 text-[11px] font-semibold tracking-[0.2em] text-ink uppercase"
            >
              <PhoneIcon className="h-4 w-4" /> {CAFE.phoneDisplay}
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
