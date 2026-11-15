import Link from "next/link";

import NewsletterForm from "@/components/NewsletterForm";
import { BeanIcon, InstagramIcon, PhoneIcon, PinIcon, WhatsAppIcon } from "@/components/Icons";
import { CAFE, waLink } from "@/lib/site";

const EXPLORE = [
  { href: "/menu", label: "The full menu", note: "35 plates & pours" },
  { href: "/ambience", label: "Ambience", note: "Eight rooms" },
  { href: "/book", label: "Table booking", note: "6 zones" },
  { href: "/order", label: "Order in", note: "Delivery & pickup" },
  { href: "/track", label: "Track an order", note: "Live status" },
  { href: "/dashboard", label: "Concierge desk", note: "Staff console" },
];

export default function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-gold/15 bg-espresso">
      <div className="pointer-events-none absolute inset-x-0 -top-24 h-48 bg-[radial-gradient(ellipse_at_center,rgba(201,164,76,0.14),transparent_70%)]" />

      <div className="relative mx-auto max-w-[1400px] px-5 pt-20 pb-10 sm:px-8">
        <div className="grid gap-14 lg:grid-cols-[1.1fr_0.85fr_0.85fr_1fr]">
          <div>
            <Link href="/" className="group inline-flex items-center gap-3">
              <BeanIcon className="h-6 w-6 text-gold transition-transform duration-700 group-hover:rotate-[24deg]" />
              <span className="font-display text-4xl tracking-[0.04em] text-cream">
                AB<span className="text-gilt italic">sip</span>
              </span>
            </Link>
            <p className="mt-5 max-w-xs text-sm leading-relaxed text-cream/55">
              A single-origin sanctuary above Pali Naka. Ninety seats, one roastery, and a kitchen
              that treats a cup of coffee with the same seriousness as a nine-course tasting.
            </p>
            <div className="mt-6 flex gap-3">
              <a
                href={waLink("Hello ABsip, I have a question about the café.")}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp"
                className="rounded-full border border-gold/25 p-2.5 text-cream/70 transition hover:border-gold hover:text-champagne"
              >
                <WhatsAppIcon className="h-4 w-4" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="rounded-full border border-gold/25 p-2.5 text-cream/70 transition hover:border-gold hover:text-champagne"
              >
                <InstagramIcon className="h-4 w-4" />
              </a>
              <a
                href={`tel:${CAFE.phoneRaw}`}
                aria-label="Call the café"
                className="rounded-full border border-gold/25 p-2.5 text-cream/70 transition hover:border-gold hover:text-champagne"
              >
                <PhoneIcon className="h-4 w-4" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="label-xs text-gold">Visit</h3>
            <address className="mt-5 space-y-2 text-sm leading-relaxed text-cream/65 not-italic">
              <p className="flex gap-2">
                <PinIcon className="mt-0.5 h-4 w-4 shrink-0 text-gold/70" />
                <span>
                  {CAFE.addressLine1}
                  <br />
                  {CAFE.addressLine2}
                </span>
              </p>
              <p>
                <a href={`tel:${CAFE.phoneRaw}`} className="transition hover:text-champagne">
                  {CAFE.phoneDisplay}
                </a>
              </p>
              <p>
                <a href={`mailto:${CAFE.email}`} className="transition hover:text-champagne">
                  {CAFE.email}
                </a>
              </p>
            </address>
            <a
              href="https://maps.google.com/?q=Pali+Naka+Bandra+West+Mumbai"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 inline-block border-b border-gold/40 pb-0.5 text-[11px] tracking-[0.2em] text-cream/70 uppercase transition hover:text-champagne"
            >
              Open in maps →
            </a>
          </div>

          <div>
            <h3 className="label-xs text-gold">Hours</h3>
            <ul className="mt-5 space-y-2">
              {CAFE.hours.map((h) => (
                <li key={h.day} className="flex items-baseline justify-between gap-3 text-[13px]">
                  <span className="text-cream/60">{h.day.slice(0, 3)}</span>
                  <span className="h-px flex-1 translate-y-[-3px] bg-gold/15" />
                  <span className="text-cream/85 tabular-nums">{h.time}</span>
                </li>
              ))}
            </ul>
            <p className="mt-4 text-[11px] leading-relaxed text-muted">
              Kitchen closes 45 minutes before the doors. Terrace Noir is weather permitting.
            </p>
          </div>

          <div>
            <h3 className="label-xs text-gold">Explore</h3>
            <ul className="mt-5 space-y-2.5">
              {EXPLORE.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="group flex items-baseline justify-between gap-3 text-sm text-cream/65 transition hover:text-champagne"
                  >
                    <span>{l.label}</span>
                    <span className="text-[10px] tracking-[0.14em] text-muted uppercase opacity-0 transition group-hover:opacity-100">
                      {l.note}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>

            <h3 className="label-xs mt-9 text-gold">The Dispatch</h3>
            <p className="mt-3 mb-4 text-[13px] leading-relaxed text-cream/55">
              One letter a month: new lots, cupping dates, private salon openings.
            </p>
            <NewsletterForm />
          </div>
        </div>

        <div className="mt-16 overflow-hidden">
          <p className="text-center font-display text-[clamp(3.5rem,15vw,13rem)] leading-[0.8] font-medium tracking-[-0.02em] text-transparent [-webkit-text-stroke:1px_rgba(201,164,76,0.22)] select-none">
            ABsip
          </p>
        </div>

        <div className="mt-8 flex flex-col items-center justify-between gap-4 border-t border-gold/15 pt-6 text-[11px] text-muted sm:flex-row">
          <p>© {new Date().getFullYear()} ABsip Coffee House Pvt. Ltd. · FSSAI 11522998000123</p>
          <p className="flex items-center gap-2">
            <span>Design &amp; demo by</span>
            <a
              href={waLink("Hi WebDhaba, I saw your ABsip demo.")}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium tracking-[0.16em] text-gold uppercase transition hover:text-champagne"
            >
              WebDhaba
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
