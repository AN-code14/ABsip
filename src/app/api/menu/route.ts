import { NextResponse } from "next/server";

import { getMenuSafe, getCategoriesSafe } from "@/lib/data";
import type { MenuFilter } from "@/lib/data";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const filter: MenuFilter = {
      category: url.searchParams.get("category") ?? undefined,
      search: url.searchParams.get("q") ?? undefined,
      vegOnly: url.searchParams.get("veg") === "1",
      signatureOnly: url.searchParams.get("signature") === "1",
    };
    const [items, categories] = await Promise.all([getMenuSafe(filter), getCategoriesSafe()]);
    return NextResponse.json({ ok: true, count: items.length, categories, items });
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : "Menu unavailable" },
      { status: 500 },
    );
  }
}
