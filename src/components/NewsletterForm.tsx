"use client";

import { useState } from "react";

import { ArrowRight, CheckIcon } from "@/components/Icons";
import { useCart } from "@/components/cart/CartProvider";

export default function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [interest, setInterest] = useState("Reserve brews");
  const [state, setState] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [message, setMessage] = useState("");
  const { toast } = useCart();

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setState("error");
      setMessage("That address doesn't look right.");
      return;
    }
    setState("sending");
    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: email.split("@")[0], email, interest }),
      });
      const data = (await res.json()) as { ok?: boolean; error?: string };
      if (!res.ok || !data.ok) throw new Error(data.error ?? "Something went wrong");
      setState("done");
      setMessage("You're on the list. The next dispatch leaves on Friday.");
      toast("Added to The Dispatch", interest);
      setEmail("");
    } catch (err) {
      setState("error");
      setMessage(err instanceof Error ? err.message : "Something went wrong");
    }
  }

  if (state === "done") {
    return (
      <div className="flex items-start gap-3 rounded-lg border border-sage/30 bg-sage/5 p-4">
        <CheckIcon className="mt-0.5 h-4 w-4 shrink-0 text-sage" />
        <p className="text-sm leading-relaxed text-cream/75">{message}</p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="space-y-3">
      <div className="flex items-center gap-2 border-b border-gold/25 pb-2 transition focus-within:border-gold">
        <input
          type="email"
          required
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            setState("idle");
          }}
          placeholder="your@email.com"
          aria-label="Email address"
          className="w-full bg-transparent text-sm text-cream placeholder:text-muted/60 focus:outline-none"
        />
        <button
          type="submit"
          disabled={state === "sending"}
          aria-label="Subscribe to The Dispatch"
          className="shrink-0 text-gold transition hover:text-champagne disabled:opacity-50"
        >
          <ArrowRight className={`h-4 w-4 ${state === "sending" ? "animate-pulse" : ""}`} />
        </button>
      </div>
      <div className="flex flex-wrap gap-2">
        {["Reserve brews", "Chef's counter", "Private events"].map((i) => (
          <button
            key={i}
            type="button"
            onClick={() => setInterest(i)}
            className={`rounded-full border px-3 py-1.5 text-[10px] tracking-[0.16em] uppercase transition ${
              interest === i
                ? "border-gold bg-gold/15 text-champagne"
                : "border-gold/20 text-cream/55 hover:border-gold/50 hover:text-cream"
            }`}
          >
            {i}
          </button>
        ))}
      </div>
      {state === "error" ? <p className="text-xs text-oxblood">{message}</p> : null}
    </form>
  );
}
