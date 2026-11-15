import type { Metadata } from "next";
import Link from "next/link";

import ConciergeConsole from "@/components/ConciergeConsole";
import Reveal from "@/components/Reveal";
import { ArrowRight, ChairIcon, ChefIcon, SparkIcon, TrayIcon } from "@/components/Icons";
import { CAFE, waLink } from "@/lib/site";

export const metadata: Metadata = {
  title: "Concierge Desk",
  description:
    "The live staff console for ABsip: tonight's tables, tickets on the pass, and status control for every reservation and order.",
};

export const dynamic = "force-dynamic";

const PROCEDURES = [
  {
    icon: <ChairIcon className="h-4 w-4" />,
    title: "Seating a table",
    body: "Mark 'seated' the moment the host walks the guests in. The zone card prints at the pass so the barista knows which room the first pour goes to.",
  },
  {
    icon: <TrayIcon className="h-4 w-4" />,
    title: "Firing a ticket",
    body: "Orders move placed → confirmed → preparing → plated → out. Confirm within two minutes; anything you cannot make tonight gets cancelled with a call, never a message.",
  },
  {
    icon: <ChefIcon className="h-4 w-4" />,
    title: "86'd items",
    body: "If a lot runs out, take it off the menu in the roastery loft notebook and tell the floor. The card on the site updates the next time the kitchen syncs.",
  },
  {
    icon: <SparkIcon className="h-4 w-4" />,
    title: "The private salon",
    body: "Room fee is charged at booking, redeemable against food and beverage. Confirm the menu 72 hours ahead and write the guest's name on the card by hand.",
  },
];

export default function DashboardPage() {
  return (
    <>
      <section className="border-b border-gold/15 bg-espresso/70 pt-[68px]">
        <div className="mx-auto max-w-[1400px] px-5 py-14 sm:px-8">
          <Reveal>
            <div className="flex items-center gap-3">
              <span className="h-px w-12 bg-gold/60" />
              <span className="label-xs text-gold">Staff console · Internal</span>
            </div>
            <div className="mt-5 flex flex-wrap items-end justify-between gap-6">
              <h1 className="max-w-3xl font-display text-[clamp(2.2rem,6vw,4.4rem)] leading-[0.96] font-medium text-cream">
                The concierge
                <span className="text-gilt italic"> desk</span>
              </h1>
              <p className="max-w-md text-[14px] leading-relaxed text-cream/55">
                Every reservation and every order written to the database lands here in real time.
                Change a status and the guest's tracking page follows within twelve seconds.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="mx-auto max-w-[1400px] px-5 py-12 sm:px-8">
        <ConciergeConsole />
      </section>

      <section className="border-t border-gold/12 bg-espresso/60 px-5 py-16 sm:px-8">
        <div className="mx-auto max-w-[1400px]">
          <Reveal>
            <h2 className="font-display text-[clamp(1.7rem,3.4vw,2.4rem)] text-cream">
              Floor <span className="text-gilt italic">procedures</span>
            </h2>
          </Reveal>
          <div className="mt-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {PROCEDURES.map((p, i) => (
              <Reveal key={p.title} delay={i * 70}>
                <div className="h-full rounded-xl border border-gold/15 bg-mocha/40 p-6 transition hover:border-gold/40">
                  <span className="text-gold">{p.icon}</span>
                  <h3 className="mt-4 font-display text-lg text-cream">{p.title}</h3>
                  <p className="mt-2 text-[12.5px] leading-relaxed text-cream/55">{p.body}</p>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal>
            <div className="mt-10 flex flex-col items-start justify-between gap-5 rounded-2xl border border-gold/20 bg-mocha/40 p-7 sm:flex-row sm:items-center">
              <div>
                <h3 className="font-display text-2xl text-cream">Need another pair of hands?</h3>
                <p className="mt-2 max-w-lg text-[13.5px] leading-relaxed text-cream/55">
                  The duty manager is on {CAFE.phoneDisplay} between {CAFE.hours[0].time.split(" — ")[0]} and 01:00.
                  For private buyouts, the events desk answers on WhatsApp.
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <a
                  href={waLink("ABsip concierge desk — I need assistance with tonight's service.")}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full bg-gold px-6 py-3.5 text-[10.5px] font-semibold tracking-[0.2em] text-ink uppercase transition hover:bg-champagne"
                >
                  Call the duty manager
                </a>
                <Link
                  href="/book"
                  className="flex items-center gap-2 rounded-full border border-gold/30 px-6 py-3.5 text-[10.5px] font-semibold tracking-[0.2em] text-cream uppercase transition hover:border-gold hover:bg-gold/10"
                >
                  Guest booking page <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
