import { NextResponse } from "next/server";

import { createBooking, getBookings, type BookingInput } from "@/lib/data";
import { addDaysISO, istDateKey } from "@/lib/time";
import { ALL_SLOTS, ZONES } from "@/lib/site";

export const dynamic = "force-dynamic";

const zoneNames: string[] = ZONES.map((z) => z.name);

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const limit = Math.min(200, Number(url.searchParams.get("limit") ?? 60) || 60);
    const rows = await getBookings(limit);
    return NextResponse.json({ ok: true, count: rows.length, bookings: rows });
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : "Bookings unavailable." },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Partial<BookingInput>;

    const guestName = (body.guestName ?? "").trim();
    const phone = (body.phone ?? "").trim();
    const email = (body.email ?? "").trim();
    const date = (body.date ?? "").trim();
    const slot = (body.slot ?? "").trim();
    const guests = Number(body.guests ?? 0);
    const zone = (body.zone ?? "").trim();

    const errors: string[] = [];
    if (guestName.length < 2) errors.push("Please tell us the name for the table.");
    if (!/^[+\d][\d\s-]{7,17}$/.test(phone)) errors.push("A reachable phone number is required.");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.push("A valid email is required for the confirmation.");
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) errors.push("Pick a date.");
    else if (date < istDateKey()) errors.push("That date has passed.");
    else if (date > addDaysISO(60)) errors.push("We take reservations up to 60 days ahead.");
    if (!ALL_SLOTS.includes(slot as (typeof ALL_SLOTS)[number])) errors.push("Pick one of the seatings shown.");
    if (!Number.isInteger(guests) || guests < 1 || guests > 20) errors.push("Parties are 1 to 20 guests.");
    if (!zoneNames.includes(zone)) errors.push("Choose one of the six zones.");

    if (errors.length) {
      return NextResponse.json({ ok: false, error: errors[0], errors }, { status: 400 });
    }

    const booking = await createBooking({
      guestName,
      phone,
      email,
      date,
      slot,
      guests,
      zone,
      occasion: body.occasion ?? null,
      requests: body.requests ?? null,
    });

    return NextResponse.json({ ok: true, booking }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Reservation could not be made.";
    return NextResponse.json({ ok: false, error: message }, { status: 409 });
  }
}
