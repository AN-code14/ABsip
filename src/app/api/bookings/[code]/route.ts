import { NextResponse } from "next/server";

import { findBooking, setBookingStatus } from "@/lib/data";
import { BOOKING_FLOW } from "@/db/schema";

export const dynamic = "force-dynamic";

type Params = { params: Promise<{ code: string }> };

export async function GET(_request: Request, { params }: Params) {
  try {
    const { code } = await params;
    const booking = await findBooking(code);
    if (!booking) {
      return NextResponse.json({ ok: false, error: "No reservation with that code." }, { status: 404 });
    }
    return NextResponse.json({ ok: true, booking });
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : "Lookup failed." },
      { status: 500 },
    );
  }
}

export async function PATCH(request: Request, { params }: Params) {
  try {
    const { code } = await params;
    const body = (await request.json()) as { status?: string };
    const status = (body.status ?? "").trim();
    if (!(BOOKING_FLOW as readonly string[]).includes(status)) {
      return NextResponse.json(
        { ok: false, error: `Status must be one of ${BOOKING_FLOW.join(", ")}.` },
        { status: 400 },
      );
    }
    const existing = await findBooking(code);
    if (!existing) {
      return NextResponse.json({ ok: false, error: "No reservation with that code." }, { status: 404 });
    }
    const booking = await setBookingStatus(existing.id, status);
    return NextResponse.json({ ok: true, booking });
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : "Update failed." },
      { status: 500 },
    );
  }
}
