import { NextResponse } from "next/server";

import { createOrder, getOrders, type OrderInput, type OrderLine } from "@/lib/data";
import { ORDER_TYPES, PAYMENT_METHODS } from "@/lib/site";

export const dynamic = "force-dynamic";

const typeIds: string[] = ORDER_TYPES.map((t) => t.id);
const paymentIds: string[] = PAYMENT_METHODS.map((p) => p.id);

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const limit = Math.min(200, Number(url.searchParams.get("limit") ?? 60) || 60);
    const rows = await getOrders(limit);
    return NextResponse.json({ ok: true, count: rows.length, orders: rows });
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : "Orders unavailable." },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Partial<OrderInput> & { lines?: OrderLine[] };

    const customerName = (body.customerName ?? "").trim();
    const phone = (body.phone ?? "").trim();
    const email = (body.email ?? "").trim();
    const orderType = (body.orderType ?? "").trim();
    const paymentMethod = (body.paymentMethod ?? "").trim();
    const address = (body.address ?? "").trim();
    const tableNo = (body.tableNo ?? "").trim();
    const lines = Array.isArray(body.lines) ? body.lines : [];

    const errors: string[] = [];
    if (customerName.length < 2) errors.push("Please give us a name for the order.");
    if (!/^[+\d][\d\s-]{7,17}$/.test(phone)) errors.push("The rider needs a reachable phone number.");
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.push("That email doesn't look right.");
    if (!typeIds.includes(orderType)) errors.push("Choose how you'd like the order served.");
    if (!paymentIds.includes(paymentMethod)) errors.push("Choose a payment method.");
    if (!lines.length) errors.push("Your tray is empty.");
    if (lines.length > 40) errors.push("For very large orders, please call the concierge.");
    if (orderType === "delivery" && address.length < 10) errors.push("A delivery address is required.");
    if (orderType === "dine-in" && !tableNo) errors.push("Tell us your table number.");

    for (const l of lines) {
      if (!Number.isInteger(l.menuItemId) || l.menuItemId <= 0) {
        errors.push("One of the items is invalid.");
        break;
      }
      if (!Number.isInteger(l.quantity) || l.quantity < 1 || l.quantity > 20) {
        errors.push("Quantity must be between 1 and 20.");
        break;
      }
    }

    if (errors.length) {
      return NextResponse.json({ ok: false, error: errors[0], errors }, { status: 400 });
    }

    const result = await createOrder(
      {
        customerName,
        phone,
        email: email || null,
        orderType,
        address: address || null,
        tableNo: tableNo || null,
        preferredTime: (body.preferredTime ?? "").trim() || null,
        paymentMethod,
        notes: (body.notes ?? "").trim() || null,
        promo: (body.promo ?? "").trim() || null,
      },
      lines,
    );

    return NextResponse.json({ ok: true, ...result }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Order could not be placed.";
    return NextResponse.json({ ok: false, error: message }, { status: 409 });
  }
}
