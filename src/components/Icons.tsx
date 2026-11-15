import type { SVGProps } from "react";

type P = SVGProps<SVGSVGElement>;

const base = (p: P) => ({
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.3,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  ...p,
});

export const CupIcon = (p: P) => (
  <svg {...base(p)}>
    <path d="M4.5 8h12v5.5a5 5 0 0 1-5 5h-2a5 5 0 0 1-5-5V8Z" />
    <path d="M16.5 9.5h1.8a2.7 2.7 0 0 1 0 5.4h-1.8" />
    <path d="M3 21h15" />
    <path d="M8.4 5.2c0-1 1-1.3 1-2.2M12 5.2c0-1 1-1.3 1-2.2" />
  </svg>
);

export const BeanIcon = (p: P) => (
  <svg {...base(p)}>
    <ellipse cx="12" cy="12" rx="6.2" ry="8.6" transform="rotate(38 12 12)" />
    <path d="M8.4 16.6c2.6-.6 3.3-3 2.6-5.4-.7-2.4.4-4.6 3-5.6" />
  </svg>
);

export const FlameIcon = (p: P) => (
  <svg {...base(p)}>
    <path d="M12 3c2.6 3.2.6 4.7 1.9 6.4 1-1 1.2-2 1.2-2 2.4 2 3.4 4.2 3.4 6.3A6.5 6.5 0 0 1 12 20.5a6.5 6.5 0 0 1-6.5-6.8C5.8 9.9 9 8.2 9 5.4c1.4.7 2.2 2 2.2 2S10.6 4.8 12 3Z" />
  </svg>
);

export const LeafIcon = (p: P) => (
  <svg {...base(p)}>
    <path d="M20 4c-8.5-.8-14 2.7-14 8.6A5.4 5.4 0 0 0 11.4 18C17 18 20.4 12.6 20 4Z" />
    <path d="M4.5 20c2.6-4.4 6-7.5 10.5-9.5" />
  </svg>
);

export const CalendarIcon = (p: P) => (
  <svg {...base(p)}>
    <rect x="3.2" y="5" width="17.6" height="16" rx="2" />
    <path d="M3.2 10h17.6M8 3v4M16 3v4" />
    <circle cx="8.5" cy="14.5" r="1" fill="currentColor" stroke="none" />
    <circle cx="12" cy="14.5" r="1" fill="currentColor" stroke="none" />
  </svg>
);

export const ClockIcon = (p: P) => (
  <svg {...base(p)}>
    <circle cx="12" cy="12" r="8.8" />
    <path d="M12 7.2V12l3.2 2" />
  </svg>
);

export const PinIcon = (p: P) => (
  <svg {...base(p)}>
    <path d="M12 21s7-5.6 7-11a7 7 0 1 0-14 0c0 5.4 7 11 7 11Z" />
    <circle cx="12" cy="10" r="2.6" />
  </svg>
);

export const PhoneIcon = (p: P) => (
  <svg {...base(p)}>
    <path d="M6.2 3.5h3l1.5 4-2 1.4a12.4 12.4 0 0 0 6.4 6.4l1.4-2 4 1.5v3c0 1-.8 1.8-1.8 1.7C11.9 19.8 4.2 12.1 3.5 5.3c-.1-1 .7-1.8 1.7-1.8Z" />
  </svg>
);

export const ChatIcon = (p: P) => (
  <svg {...base(p)}>
    <path d="M20.5 11.7A8.4 8.4 0 0 1 8.2 19.3l-4.6 1.2 1.3-4.4A8.4 8.4 0 1 1 20.5 11.7Z" />
    <path d="M9 9.3c.3-.7.6-.7.9-.7h.6c.2 0 .5 0 .7.6l.8 1.9c.1.2 0 .4-.1.6l-.5.6c-.1.2-.2.4 0 .7a7 7 0 0 0 3 2.5c.3.1.5.1.6-.1l.5-.7c.2-.2.4-.2.6-.1l1.7.9" />
  </svg>
);

export const WhatsAppIcon = (p: P) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...p}>
    <path d="M12.04 2c-5.5 0-9.96 4.46-9.96 9.96 0 1.76.46 3.48 1.34 5L2 22l5.2-1.36a9.9 9.9 0 0 0 4.84 1.24h.01c5.5 0 9.96-4.46 9.96-9.96A9.9 9.9 0 0 0 19.1 4.9 9.9 9.9 0 0 0 12.04 2Zm0 18.2h-.01a8.2 8.2 0 0 1-4.19-1.15l-.3-.18-3.09.81.82-3.01-.2-.31a8.22 8.22 0 0 1-1.26-4.39c0-4.54 3.7-8.24 8.24-8.24a8.2 8.2 0 0 1 5.83 2.41 8.18 8.18 0 0 1 2.41 5.83c0 4.55-3.7 8.23-8.25 8.23Zm4.52-6.16c-.25-.13-1.47-.72-1.69-.8-.23-.09-.39-.13-.56.12-.16.25-.64.8-.78.97-.14.16-.29.18-.53.06-.25-.13-1.05-.39-1.99-1.23-.74-.66-1.23-1.47-1.38-1.72-.14-.25-.01-.38.11-.5.11-.11.25-.29.37-.43.13-.15.17-.25.25-.41.08-.17.04-.31-.02-.43-.06-.13-.56-1.34-.76-1.84-.2-.48-.4-.42-.56-.42h-.47c-.17 0-.43.06-.66.31-.22.25-.86.85-.86 2.06 0 1.22.88 2.39 1 2.55.13.17 1.74 2.65 4.2 3.72.59.25 1.05.4 1.4.52.59.19 1.13.16 1.55.1.48-.07 1.47-.6 1.68-1.19.2-.58.2-1.08.14-1.19-.06-.1-.22-.16-.47-.28Z" />
  </svg>
);

export const ArrowRight = (p: P) => (
  <svg {...base(p)}>
    <path d="M4 12h15M13 6l6 6-6 6" />
  </svg>
);

export const ArrowUpRight = (p: P) => (
  <svg {...base(p)}>
    <path d="M7 17 17 7M8.5 7H17v8.5" />
  </svg>
);

export const PlusIcon = (p: P) => (
  <svg {...base(p)}>
    <path d="M12 5v14M5 12h14" />
  </svg>
);

export const MinusIcon = (p: P) => (
  <svg {...base(p)}>
    <path d="M5 12h14" />
  </svg>
);

export const CloseIcon = (p: P) => (
  <svg {...base(p)}>
    <path d="M6 6l12 12M18 6 6 18" />
  </svg>
);

export const SearchIcon = (p: P) => (
  <svg {...base(p)}>
    <circle cx="11" cy="11" r="6.6" />
    <path d="m16 16 4.5 4.5" />
  </svg>
);

export const StarIcon = (p: P) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...p}>
    <path d="m12 3.6 2.5 5.4 5.9.7-4.4 4 1.2 5.8L12 16.6 6.8 19.5 8 13.7 3.6 9.7l5.9-.7L12 3.6Z" />
  </svg>
);

export const ChairIcon = (p: P) => (
  <svg {...base(p)}>
    <path d="M6.5 4h11v7h-11z" />
    <path d="M5 11h14v4a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-4Z" />
    <path d="M7 17v3M17 17v3" />
  </svg>
);

export const SparkIcon = (p: P) => (
  <svg {...base(p)}>
    <path d="M12 3.5c.9 4.3 2.2 5.6 6.5 6.5-4.3.9-5.6 2.2-6.5 6.5-.9-4.3-2.2-5.6-6.5-6.5 4.3-.9 5.6-2.2 6.5-6.5Z" />
    <path d="M18.5 16.5c.3 1.6.8 2.1 2.4 2.4-1.6.3-2.1.8-2.4 2.4-.3-1.6-.8-2.1-2.4-2.4 1.6-.3 2.1-.8 2.4-2.4Z" />
  </svg>
);

export const ChefIcon = (p: P) => (
  <svg {...base(p)}>
    <path d="M6.5 12a3.5 3.5 0 1 1 1.6-6.6 4 4 0 0 1 7.8 0A3.5 3.5 0 1 1 17.5 12Z" />
    <path d="M6.8 12v6.4a1.8 1.8 0 0 0 1.8 1.8h6.8a1.8 1.8 0 0 0 1.8-1.8V12" />
    <path d="M10 16v3M14 16v3" />
  </svg>
);

export const TrayIcon = (p: P) => (
  <svg {...base(p)}>
    <path d="M3.5 14h17l-1.6 4.4a2 2 0 0 1-1.9 1.4H7a2 2 0 0 1-1.9-1.4L3.5 14Z" />
    <path d="M6.4 10.6 12 4l5.6 6.6" />
  </svg>
);

export const ScooterIcon = (p: P) => (
  <svg {...base(p)}>
    <circle cx="6" cy="17.5" r="2.6" />
    <circle cx="18" cy="17.5" r="2.6" />
    <path d="M8.6 17.5h6.8M15.4 17.5 13 6.5h-2.4M13 10h3.4l1.6 7.5" />
  </svg>
);

export const CheckIcon = (p: P) => (
  <svg {...base(p)}>
    <path d="m5 12.5 4.5 4.5L19 7" />
  </svg>
);

export const BarsIcon = (p: P) => (
  <svg {...base(p)}>
    <path d="M4 7h16M4 12h16M4 17h10" />
  </svg>
);

export const BagIcon = (p: P) => (
  <svg {...base(p)}>
    <path d="M5.5 8h13l1 12h-15l1-12Z" />
    <path d="M9 8V6.2a3 3 0 0 1 6 0V8" />
  </svg>
);

export const InstagramIcon = (p: P) => (
  <svg {...base(p)}>
    <rect x="3.6" y="3.6" width="16.8" height="16.8" rx="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17" cy="7" r="0.9" fill="currentColor" stroke="none" />
  </svg>
);

export const NoteIcon = (p: P) => (
  <svg {...base(p)}>
    <path d="M6 3.5h9L19 8v12.5H6z" />
    <path d="M14.5 3.5V8H19M9 12h6M9 15.5h6" />
  </svg>
);

export const WaveIcon = (p: P) => (
  <svg {...base(p)}>
    <path d="M2 14c2-3 4-3 6 0s4 3 6 0 4-3 6 0" />
    <path d="M2 18c2-3 4-3 6 0s4 3 6 0 4-3 6 0" opacity=".45" />
  </svg>
);
