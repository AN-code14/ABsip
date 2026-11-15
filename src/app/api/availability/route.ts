import { NextResponse } from "next/server";

import { getSlotLoad } from "@/lib/data";
import { ALL_SLOTS } from "@/lib/site";
import { addDaysISO, istDateKey } from "@/lib/time";

export const dynamic = "force-dynamic";

const CAPACITY = 22;

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const raw = url.searchParams.get("date") ?? istDateKey();
    if (!/^\d{4}-\d{2}-\d{2}$/.test(raw)) {
      return NextResponse.json({ ok: false, error: "Date must be YYYY-MM-DD." }, { status: 400 });
    }
    const guests = Math.max(1, Math.min(20, Number(url.searchParams.get("guests") ?? 2) || 2));

    const today = istDateKey();
    if (raw < today) {
      return NextResponse.json({ ok: false, error: "That date has already passed." }, { status: 400 });
    }
    if (raw > addDaysISO(60)) {
      return NextResponse.json(
        { ok: false, error: "We only take reservations up to 60 days ahead." },
        { status: 400 },
      );
    }

    const load = await getSlotLoad(raw);
    const nowMinutes = (() => {
      const d = new Date();
      const ist = new Date(d.getTime() + (d.getTimezoneOffset() + 330) * 60_000);
      return ist.getHours() * 60 + ist.getMinutes();
    })();

    const slots = ALL_SLOTS.map((slot) => {
      const [hh, mm] = slot.split(":").map(Number);
      const slotMinutes = (hh ?? 0) * 60 + (mm ?? 0);
      const booked = load.get(slot) ?? 0;
      const seats = Math.max(0, CAPACITY - booked);
      const passed = raw === today && slotMinutes + 45 < (nowMinutes < 240 ? nowMinutes + 1440 : nowMinutes);
      let state: "open" | "limited" | "full" | "passed" = "open";
      if (passed) state = "passed";
      else if (seats < guests) state = "full";
      else if (seats <= 6) state = "limited";
      return { slot, booked, seats, state };
    });

    return NextResponse.json({
      ok: true,
      date: raw,
      capacity: CAPACITY,
      guests,
      slots,
      open: slots.filter((s) => s.state === "open" || s.state === "limited").length,
    });
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : "Availability unavailable." },
      { status: 500 },
    );
  }
}
