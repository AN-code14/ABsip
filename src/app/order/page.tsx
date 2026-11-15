import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import OrderFlow from "@/components/OrderFlow";
import Reveal from "@/components/Reveal";
import { ArrowRight, ChefIcon, FlameIcon, ScooterIcon, SparkIcon } from "@/components/Icons";
import { AMBIENCE, KITCHEN } from "@/lib/images";
import { getMenuSafe } from "@/lib/data";
import { CAFE, waLink } from "@/lib/site";

export const metadata: Metadata = {
  title: "Order In",
  description:
    "Order the ABsip menu to your table, collect from the marble pass, or have the concierge deliver within six kilometres of Bandra West.",
};

export const dynamic = "force-dynamic";

const PROMISES = [
  {
    icon: <ChefIcon className="h-5 w-5" />,
    title: "Plated to order",
    body: "Nothing sits under a lamp. The ticket fires when your rider is eight minutes away or your table is set.",
  },
  {
    icon: <FlameIcon className="h-5 w-5" />,
    title: "Thermal lacquer boxes",
    body: "Pastry travels in rigid boxes with the lot card tucked inside; hot plates in double-walled carriers.",
  },
  {
    icon: <ScooterIcon className="h-5 w-5" />,
    title: "Six-kilometre radius",
    body: "Bandra, Khar, Pali Hill and Worli sea face. Beyond that, collect from the pass and we'll pack it to travel.",
  },
  {
    icon: <SparkIcon className="h-5 w-5" />,
    title: "Confirmed by a human",
    body: "Every ticket is read aloud on the pass and confirmed within two minutes. No automated guesswork.",
  },
];

export default async function OrderPage() {
  const items = await getMenuSafe();
  const suggestions = items.filter((i) => i.isSignature).slice(0, 6);
  const rest = items.filter((i) => !i.isSignature).slice(0, 3);
  const popular = [...suggestions, ...rest];

  return (
    <>
      <section className="grain relative overflow-hidden border-b border-gold/15 pt-[68px]">
        <Image
          src={KITCHEN.artisticPlate}
          alt="A dish from the ABsip kitchen"
          fill
          priority
          sizes="100vw"
          className="object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-ink/88 via-ink/74 to-ink" />
        <div className="relative mx-auto max-w-[1400px] px-5 py-18 sm:px-8 lg:py-24">
          <Reveal>
            <div className="flex items-center gap-3">
              <span className="h-px w-12 bg-gold/60" />
              <span className="label-xs text-gold">Food ordering · 08:00 — 01:00</span>
            </div>
            <h1 className="mt-5 max-w-4xl font-display text-[clamp(2.6rem,7.4vw,6rem)] leading-[0.94] font-medium text-cream">
              The kitchen,
              <br />
              <span className="text-gilt italic">wherever you are</span>
            </h1>
            <p className="mt-6 max-w-xl text-[15px] leading-relaxed text-cream/60">
              To your reserved table, to the marble pass, or to your door in a thermal lacquer box.
              Prices are live, promos are checked by the server, and the bill below is the bill you
              pay.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="mx-auto max-w-[1400px] px-5 py-14 sm:px-8">
        <OrderFlow suggestions={popular} />
      </section>

      {/* promises */}
      <section className="border-y border-gold/12 bg-espresso/60 px-5 py-20 sm:px-8">
        <div className="mx-auto max-w-[1400px]">
          <Reveal>
            <h2 className="font-display text-[clamp(1.8rem,3.6vw,2.6rem)] text-cream">
              How the order <span className="text-gilt italic">travels</span>
            </h2>
          </Reveal>
          <div className="mt-9 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {PROMISES.map((p, i) => (
              <Reveal key={p.title} delay={i * 70}>
                <div className="h-full rounded-xl border border-gold/15 bg-mocha/40 p-6 transition hover:border-gold/40">
                  <span className="text-gold">{p.icon}</span>
                  <h3 className="mt-4 font-display text-xl text-cream">{p.title}</h3>
                  <p className="mt-2.5 text-[13px] leading-relaxed text-cream/55">{p.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* dine-in cross sell */}
      <section className="relative overflow-hidden">
        <Image
          src={AMBIENCE.grandHall}
          alt="The Grand Hall at ABsip"
          fill
          sizes="100vw"
          className="animate-ken-burns object-cover opacity-25"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/85 to-ink/60" />
        <div className="relative mx-auto grid max-w-[1400px] gap-10 px-5 py-20 sm:px-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <Reveal>
            <div>
              <span className="label-xs text-gold">Better still</span>
              <h2 className="mt-4 font-display text-[clamp(1.9rem,4vw,3rem)] leading-tight text-cream">
                Eat it in the room
                <br />
                <span className="text-gilt italic">it was made for</span>
              </h2>
              <p className="mt-5 max-w-lg text-[14.5px] leading-relaxed text-cream/60">
                Reserve a table and pre-order ahead — the kitchen will have your first course plated
                the moment you sit down. No waiting, no bill surprise, and the tiramisu cart still
                comes round at the end.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  href="/book"
                  className="sheen flex items-center gap-3 rounded-full bg-gold px-7 py-4 text-[10.5px] font-semibold tracking-[0.22em] text-ink uppercase transition hover:bg-champagne"
                >
                  Reserve a table <ArrowRight className="h-4 w-4" />
                </Link>
                <a
                  href={waLink(`Hello ABsip, I'd like to place an order for ${CAFE.addressLine2}.`)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full border border-gold/35 px-7 py-4 text-[10.5px] font-semibold tracking-[0.22em] text-cream uppercase transition hover:border-gold hover:bg-gold/10"
                >
                  Order on WhatsApp
                </a>
              </div>
            </div>
          </Reveal>

          <Reveal delay={110}>
            <div className="rounded-2xl border border-gold/20 bg-ink/70 p-7 backdrop-blur-md">
              <p className="label-xs text-gold">Kitchen facts</p>
              <ul className="mt-5 divide-y divide-gold/12">
                {[
                  ["Last order", "00:15 daily"],
                  ["Average prep", "14 minutes"],
                  ["Delivery radius", "6 km from Pali Naka"],
                  ["Delivery fee", "₹149 · free above ₹2,500"],
                  ["Service charge (dine-in)", "5%"],
                  ["GST", "5% on the bill"],
                  ["Packing", "Thermal lacquer, plastic-free"],
                ].map(([k, v]) => (
                  <li key={k} className="flex items-baseline justify-between gap-4 py-3 text-[13px]">
                    <span className="text-cream/60">{k}</span>
                    <span className="text-right text-cream/90 tabular-nums">{v}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
