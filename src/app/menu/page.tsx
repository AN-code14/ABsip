import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import MenuExplorer from "@/components/MenuExplorer";
import Reveal from "@/components/Reveal";
import { ArrowRight, BeanIcon, ChefIcon, FlameIcon, LeafIcon } from "@/components/Icons";
import { BREWS, KITCHEN } from "@/lib/images";
import { getCategoriesSafe, getMenuSafe } from "@/lib/data";
import { CATEGORIES } from "@/db/seed-data";
import { inr } from "@/lib/money";
import { waLink } from "@/lib/site";

export const metadata: Metadata = {
  title: "The Menu",
  description:
    "Nine chapters, thirty-five plates and pours — reserve brews, cold craft, small plates, kitchen mains, pâtisserie and the zero-proof bar at ABsip.",
};

export const dynamic = "force-dynamic";

const TASTING = [
  { course: "I", name: "Estate cupping flight", note: "Three 90 ml pours, cupped at the counter" },
  { course: "II", name: "Truffle & Parmesan focaccia", note: "Torn at the table, 48-hour dough" },
  { course: "III", name: "Burrata, blood orange", note: "Basil oil pressed in-house" },
  { course: "IV", name: "Bombay masala croissant", note: "Curry-leaf chutney butter, crisp sev" },
  { course: "V", name: "Araku amber siphon", note: "Brewed as a palate reset" },
  { course: "VI", name: "Wild mushroom & barley risotto", note: "Porcini dust crisp" },
  { course: "VII", name: "Coffee-rubbed lamb shoulder", note: "Eight hours, jaggery crust" },
  { course: "VIII", name: "Tiramisu noir", note: "Cacao grated over the plate" },
  { course: "IX", name: "Sugar cage — rose & lychee", note: "Cracked open with a warm spoon" },
];

export default async function MenuPage() {
  const [items, categories] = await Promise.all([getMenuSafe(), getCategoriesSafe()]);
  const vegCount = items.filter((i) => i.isVeg).length;

  return (
    <>
      {/* header */}
      <section className="grain relative overflow-hidden border-b border-gold/15 pt-[68px]">
        <Image
          src={BREWS.dramaticShadow}
          alt="Espresso poured at ABsip"
          fill
          priority
          sizes="100vw"
          className="object-cover opacity-35"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-ink/85 via-ink/70 to-ink" />
        <div className="relative mx-auto max-w-[1400px] px-5 py-20 sm:px-8 lg:py-28">
          <Reveal>
            <div className="flex items-center gap-3">
              <span className="h-px w-12 bg-gold/60" />
              <span className="label-xs text-gold">Chapter card · Winter</span>
            </div>
            <h1 className="mt-5 max-w-4xl font-display text-[clamp(2.8rem,8vw,6.5rem)] leading-[0.92] font-medium text-cream">
              Thirty-five ways
              <br />
              <span className="text-gilt italic">to slow down</span>
            </h1>
            <p className="mt-6 max-w-xl text-[15px] leading-relaxed text-cream/60">
              Nine chapters, written by the bar and the kitchen together. Prices are in rupees and
              inclusive of the estate levy; five per cent GST is added at the bill. Tap any plate for
              its story, provenance and pairing.
            </p>
          </Reveal>

          <Reveal delay={120}>
            <div className="mt-10 flex flex-wrap gap-x-10 gap-y-4 border-t border-gold/15 pt-6">
              {[
                { icon: <BeanIcon className="h-4 w-4" />, k: `${items.length}`, v: "items on the card" },
                { icon: <LeafIcon className="h-4 w-4" />, k: `${vegCount}`, v: "vegetarian" },
                { icon: <ChefIcon className="h-4 w-4" />, k: "9", v: "chapters" },
                { icon: <FlameIcon className="h-4 w-4" />, k: `${inr(Math.min(...items.map((i) => i.price)))}`, v: "smallest bill" },
              ].map((f) => (
                <div key={f.v} className="flex items-center gap-3">
                  <span className="text-gold/80">{f.icon}</span>
                  <div>
                    <p className="font-display text-2xl leading-none text-cream">{f.k}</p>
                    <p className="mt-1 text-[10px] tracking-[0.2em] text-muted uppercase">{f.v}</p>
                  </div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* chapters */}
      <section className="mx-auto max-w-[1400px] px-5 pt-14 sm:px-8">
        <Reveal>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <h2 className="font-display text-3xl text-cream">The chapters</h2>
            <p className="text-[12px] tracking-[0.18em] text-muted uppercase">
              Service runs 08:00 — 01:00 · Kitchen closes 45 min before
            </p>
          </div>
        </Reveal>
        <div className="mt-6 grid gap-px overflow-hidden rounded-xl border border-gold/15 bg-gold/12 sm:grid-cols-2 lg:grid-cols-3">
          {CATEGORIES.map((c, i) => (
            <Reveal key={c.id} delay={i * 45}>
              <div className="group flex h-full items-start gap-4 bg-espresso px-5 py-5 transition-colors duration-500 hover:bg-mocha">
                <span className="font-display text-lg text-gold/45 tabular-nums">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div>
                  <h3 className="font-display text-lg text-cream transition group-hover:text-champagne">
                    {c.id}
                  </h3>
                  <p className="mt-1 text-[12.5px] leading-relaxed text-cream/50">{c.note}</p>
                  <p className="label-xs mt-2 text-muted">{c.items} items</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* explorer */}
      <section className="mx-auto max-w-[1400px] px-5 pb-24 sm:px-8">
        <div className="mt-14">
          <MenuExplorer items={items} categories={categories} />
        </div>
      </section>

      {/* tasting menu */}
      <section className="relative overflow-hidden border-y border-gold/15 bg-espresso">
        <Image
          src={KITCHEN.sugarSculpture}
          alt="Plated dessert from the ABsip tasting menu"
          fill
          sizes="100vw"
          className="object-cover opacity-20"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/85 to-ink/60" />
        <div className="relative mx-auto grid max-w-[1400px] gap-12 px-5 py-20 sm:px-8 lg:grid-cols-[0.9fr_1.1fr]">
          <Reveal>
            <div className="lg:sticky lg:top-28">
              <span className="label-xs flex items-center gap-2 text-gold">
                <ChefIcon className="h-4 w-4" /> Chef's counter
              </span>
              <h2 className="mt-4 font-display text-[clamp(2rem,4.4vw,3.4rem)] leading-[1.02] text-cream">
                The nine-course
                <br />
                <span className="text-gilt italic">counter menu</span>
              </h2>
              <p className="mt-5 max-w-md text-[14.5px] leading-relaxed text-cream/60">
                Six stools facing the pass. Two hours, nine courses, and a brew chosen for each. The
                menu is written by hand every evening and never repeats twice in a month.
              </p>
              <p className="mt-7 font-display text-4xl text-champagne">
                {inr(4800)} <span className="font-body text-[11px] tracking-[0.2em] text-muted uppercase">per guest</span>
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <Link
                  href="/book"
                  className="sheen flex items-center gap-3 rounded-full bg-gold px-6 py-3.5 text-[10.5px] font-semibold tracking-[0.2em] text-ink uppercase transition hover:bg-champagne"
                >
                  Book the counter <ArrowRight className="h-4 w-4" />
                </Link>
                <a
                  href={waLink("Hello ABsip, I'd like to know more about the nine-course counter menu.")}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full border border-gold/35 px-6 py-3.5 text-[10.5px] font-semibold tracking-[0.2em] text-cream uppercase transition hover:border-gold hover:bg-gold/10"
                >
                  Ask the chef
                </a>
              </div>
            </div>
          </Reveal>

          <Reveal delay={100}>
            <ol className="divide-y divide-gold/12 overflow-hidden rounded-2xl border border-gold/18 bg-ink/70 backdrop-blur-md">
              {TASTING.map((c) => (
                <li key={c.course} className="group flex items-baseline gap-5 px-6 py-4 transition hover:bg-mocha/60">
                  <span className="w-8 shrink-0 font-display text-sm text-gold/70">{c.course}</span>
                  <div className="min-w-0">
                    <p className="font-display text-[19px] leading-tight text-cream transition group-hover:text-champagne">
                      {c.name}
                    </p>
                    <p className="mt-1 text-[12.5px] text-cream/50">{c.note}</p>
                  </div>
                </li>
              ))}
            </ol>
          </Reveal>
        </div>
      </section>

      {/* notes */}
      <section className="mx-auto max-w-[1400px] px-5 py-20 sm:px-8">
        <div className="grid gap-6 md:grid-cols-3">
          {[
            {
              title: "Allergens & diets",
              body: "Every dish can be made gluten-free or vegan with 24 hours' notice. Nuts, dairy and sesame are present in the pâtisserie; the kitchen keeps a separate bench.",
              icon: <LeafIcon className="h-5 w-5" />,
            },
            {
              title: "Provenance card",
              body: "Ask your server for the lot card. It names the estate, the farmer, the altitude, the process and the roast date of what is in your cup.",
              icon: <BeanIcon className="h-5 w-5" />,
            },
            {
              title: "Taking it home",
              body: "Beans are sold in 250 g lacquer tins from the pass, ground to your method. Pâtisserie travels in boxes tied with grosgrain ribbon.",
              icon: <FlameIcon className="h-5 w-5" />,
            },
          ].map((n, i) => (
            <Reveal key={n.title} delay={i * 90}>
              <div className="h-full rounded-xl border border-gold/15 bg-mocha/40 p-6 transition hover:border-gold/35">
                <span className="text-gold">{n.icon}</span>
                <h3 className="mt-4 font-display text-xl text-cream">{n.title}</h3>
                <p className="mt-2.5 text-[13.5px] leading-relaxed text-cream/55">{n.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>
    </>
  );
}
