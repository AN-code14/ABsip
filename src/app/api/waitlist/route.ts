import { NextResponse } from "next/server";

import { addWaitlistEntry } from "@/lib/data";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { name?: string; email?: string; interest?: string };
    const email = (body.email ?? "").trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ ok: false, error: "A valid email is required." }, { status: 400 });
    }
    const row = await addWaitlistEntry((body.name ?? "Guest").trim() || "Guest", email, body.interest);
    return NextResponse.json({ ok: true, id: row.id });
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : "Could not join the list." },
      { status: 500 },
    );
  }
}
