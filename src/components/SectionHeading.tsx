import type { ReactNode } from "react";

import Reveal from "@/components/Reveal";

export default function SectionHeading({
  eyebrow,
  title,
  lede,
  align = "left",
  aside,
}: {
  eyebrow: string;
  title: ReactNode;
  lede?: ReactNode;
  align?: "left" | "center";
  aside?: ReactNode;
}) {
  return (
    <div
      className={`flex flex-col gap-6 ${
        align === "center" ? "items-center text-center" : "md:flex-row md:items-end md:justify-between"
      }`}
    >
      <Reveal className={align === "center" ? "max-w-2xl" : "max-w-2xl"}>
        <div className={`flex items-center gap-3 ${align === "center" ? "justify-center" : ""}`}>
          <span className="h-px w-10 bg-gold/60" />
          <span className="label-xs text-gold">{eyebrow}</span>
        </div>
        <h2 className="mt-4 font-display text-[clamp(2rem,4.6vw,3.6rem)] leading-[1.02] font-medium text-cream">
          {title}
        </h2>
        {lede ? <p className="mt-4 text-[15px] leading-relaxed text-cream/60">{lede}</p> : null}
      </Reveal>
      {aside ? <Reveal delay={120}>{aside}</Reveal> : null}
    </div>
  );
}
