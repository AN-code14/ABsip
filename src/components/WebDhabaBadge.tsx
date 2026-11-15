import { CAFE, waLink } from "@/lib/site";
import { WhatsAppIcon } from "@/components/Icons";

/**
 * Permanent credit + WhatsApp CTA.
 * Small black rounded square, pinned to the lower-left corner of every page.
 */
export default function WebDhabaBadge() {
  const message = `Hello WebDhaba 👋  I'm looking at the ${CAFE.name} luxury café demo and I'd like to build something like this.`;

  return (
    <a
      href={waLink(message)}
      target="_blank"
      rel="noopener noreferrer nofollow"
      aria-label="Demo by WebDhaba — chat on WhatsApp"
      className="group fixed bottom-4 left-4 z-[95] flex h-14 items-center animate-fade-up rounded-2xl bg-black text-cream shadow-[0_18px_40px_-14px_rgba(0,0,0,0.95)] ring-1 ring-gold/35 transition-all duration-500 hover:ring-gold/80 [animation-delay:900ms]"
    >
      <span className="relative flex h-14 w-14 shrink-0 flex-col items-center justify-center gap-[1px] rounded-2xl border-r border-gold/20 px-1 text-center">
        <span className="text-[7.5px] font-medium uppercase leading-none tracking-[0.16em] text-muted">
          Demo by
        </span>
        <span className="font-display text-[12.5px] font-semibold leading-none tracking-tight text-champagne">
          WebDhaba
        </span>
        <span className="absolute -top-0.5 -right-0.5 h-2 w-2 rounded-full bg-[#25D366] shadow-[0_0_10px_2px_rgba(37,211,102,0.75)]">
          <span className="absolute inset-0 animate-ping rounded-full bg-[#25D366]/70" />
        </span>
      </span>

      <span className="flex max-w-0 items-center overflow-hidden whitespace-nowrap transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:max-w-[190px]">
        <span className="flex items-center gap-2 px-3.5 text-[10.5px] font-medium uppercase tracking-[0.18em] text-cream/85">
          <WhatsAppIcon className="h-4 w-4 text-[#25D366]" />
          Chat on WhatsApp
        </span>
      </span>
    </a>
  );
}
