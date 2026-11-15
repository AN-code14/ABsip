import { NextResponse } from "next/server";

import { quoteOrder, type OrderLine } from "@/lib/data";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      orderType?: string;
      promo?: string | null;
      lines?: OrderLine[];
    };
    const lines = Array.isArray(body.lines) ? body.lines : [];
    if (!lines.length) {
      return NextResponse.json({ ok: false, error: "Your tray is empty." }, { status: 400 });
    }
    const quote = await quoteOrder(
      { orderType: body.orderType ?? "pickup", promo: body.promo ?? null },
      lines,
    );
    return NextResponse.json({ ok: true, quote });
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : "Could not price the tray." },
      { status: 409 },
    );
  }
}
