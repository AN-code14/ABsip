import type { ReactNode } from "react";

export default function Marquee({
  children,
  speed = "normal",
  reverse = false,
  className = "",
}: {
  children: ReactNode;
  speed?: "normal" | "slow";
  reverse?: boolean;
  className?: string;
}) {
  return (
    <div className={`relative flex overflow-hidden ${className}`}>
      <div
        className={`flex w-max shrink-0 items-center ${
          speed === "slow" ? "animate-marquee-slow" : "animate-marquee"
        } ${reverse ? "[animation-direction:reverse]" : ""}`}
      >
        <div className="flex items-center">{children}</div>
        <div className="flex items-center" aria-hidden>
          {children}
        </div>
      </div>
    </div>
  );
}
