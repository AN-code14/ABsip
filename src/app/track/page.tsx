import type { Metadata } from "next";
import { Suspense } from "react";
import Image from "next/image";
import Link from "next/link";

import Tracker from "@/components/Tracker";
import Reveal from "@/components/Reveal";
import { ArrowRight, ChatIcon, ClockIcon, PhoneIcon } from "@/components/Icons";
import { AMBIENCE } from "@/lib/images";
import { CAFE, waLink } from "@/lib/site";

export const metadata: Metadata = {
  title: "Track",
  description:
    "Follow an ABsip order from the pass to your door, or check the status of a table reservation.",
};

export const dynamic = "force-dynamic";

export default function TrackPage() {
  return (
    <>
      <section className="grain relative overflow-hidden border-b border-gold/15 pt-[68px]">
        <Image
          src={AMBIENCE.counter}
          alt="The marble pass at ABsip"
          fill
          priority
          sizes="100vw"
          className="object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-ink/88 via-ink/72 to-ink" />
        <div className="relative mx-auto max-w-[1400px] px-5 py-16 sm:px-8 lg:py-20">
          <Reveal>
            <div className="flex items-center gap-3">
              <span className="h-px w-12 bg-gold/60" />
              <span className="label-xs text-gold">Live status</span>
            </div>
            <h1 className="mt-5 max-w-3xl font-display text-[clamp(2.4rem,6.6vw,5rem)] leading-[0.95] font-medium text-cream">
              Where is it
              <span className="text-gilt italic"> right now?</span>
            </h1>
            <p className="mt-5 max-w-xl text-[15px] leading-relaxed text-cream/60">
              Enter the code from your confirmation. Orders update themselves every twelve seconds
              while the kitchen works the ticket; reservations show the floor manager's status.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="mx-auto max-w-[1400px] px-5 py-14 sm:px-8">
        <Suspense fallback={<div className="mx-auto h-40 max-w-4xl animate-pulse rounded-2xl border border-gold/15 bg-espresso/60" />}>
          <Tracker />
        </Suspense>
      </section>

      <section className="border-t border-gold/12 bg-espresso/60 px-5 py-16 sm:px-8">
        <div className="mx-auto grid max-w-[1400px] gap-5 md:grid-cols-3">
          {[
            {
              icon: <ClockIcon className="h-5 w-5" />,
              title: "Something running late?",
              body: "If a ticket slips past its estimate by more than ten minutes, the concierge messages you first — with a complimentary round on the way.",
              href: waLink("Hello ABsip, my order seems to be running late. Can you check?"),
              cta: "Ping us on WhatsApp",
              external: true,
            },
            {
              icon: <PhoneIcon className="h-5 w-5" />,
              title: "Speak to the desk",
              body: `The concierge answers between ${CAFE.hours[0].time.split(" — ")[0]} and 01:00, every day. Ask for the floor manager for reservations.`,
              href: `tel:${CAFE.phoneRaw}`,
              cta: CAFE.phoneDisplay,
              external: false,
            },
            {
              icon: <ChatIcon className="h-5 w-5" />,
              title: "Change or cancel",
              body: "Reservations can be cancelled free of charge up to four hours before the seating. Orders can be changed until the kitchen confirms them.",
              href: "/book",
              cta: "Manage a reservation",
              external: false,
            },
          ].map((c, i) => {
            const inner = (
              <>
                <span className="text-gold">{c.icon}</span>
                <h3 className="mt-4 font-display text-xl text-cream">{c.title}</h3>
                <p className="mt-2.5 text-[13px] leading-relaxed text-cream/55">{c.body}</p>
                <span className="mt-4 inline-flex items-center gap-2 text-[10.5px] tracking-[0.2em] text-gold uppercase">
                  {c.cta} <ArrowRight className="h-3.5 w-3.5" />
                </span>
              </>
            );
            return (
              <Reveal key={c.title} delay={i * 70}>
                {c.external ? (
                  <a
                    href={c.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block h-full rounded-xl border border-gold/15 bg-mocha/40 p-6 transition hover:border-gold/45 hover:bg-mocha/70"
                  >
                    {inner}
                  </a>
                ) : (
                  <Link href={c.href} className="block h-full rounded-xl border border-gold/15 bg-mocha/40 p-6 transition hover:border-gold/45 hover:bg-mocha/70">
                    {inner}
                  </Link>
                )}
              </Reveal>
            );
          })}
        </div>
      </section>
    </>
  );
}
