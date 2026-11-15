import { NextResponse } from "next/server";

import { findOrder, setOrderStatus } from "@/lib/data";
import { ORDER_FLOW } from "@/db/schema";

export const dynamic = "force-dynamic";

type Params = { params: Promise<{ code: string }> };

export async function GET(_request: Request, { params }: Params) {
  try {
    const { code } = await params;
    const order = await findOrder(code);
    if (!order) {
      return NextResponse.json({ ok: false, error: "No order with that code." }, { status: 404 });
    }
    return NextResponse.json({ ok: true, order });
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
    if (!(ORDER_FLOW as readonly string[]).includes(status)) {
      return NextResponse.json(
        { ok: false, error: `Status must be one of ${ORDER_FLOW.join(", ")}.` },
        { status: 400 },
      );
    }
    const existing = await findOrder(code);
    if (!existing) {
      return NextResponse.json({ ok: false, error: "No order with that code." }, { status: 404 });
    }
    const order = await setOrderStatus(existing.id, status);
    return NextResponse.json({ ok: true, order });
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : "Update failed." },
      { status: 500 },
    );
  }
}
