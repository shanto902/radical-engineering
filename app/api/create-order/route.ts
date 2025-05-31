// app/api/create-order/route.ts
import { NextRequest, NextResponse } from "next/server";
import directus from "@/lib/directus";
import { createItem, createItems } from "@directus/sdk";

function generateOrderId() {
  const now = new Date();
  return `${now.getFullYear()}${(now.getMonth() + 1)
    .toString()
    .padStart(2, "0")}${now.getDate().toString().padStart(2, "0")}${now
    .getTime()
    .toString()
    .slice(-6)}`;
}

function getBangladeshTimeISO() {
  const now = new Date();
  // Convert to UTC+6 by adding 6 hours (in milliseconds)
  const bangladeshOffsetMs = 6 * 60 * 60 * 1000;
  const bdTime = new Date(now.getTime() + bangladeshOffsetMs);
  return bdTime.toISOString();
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, phone, address, total, items } = body;

    // ✅ Validate fields
    if (
      !name ||
      typeof name !== "string" ||
      !phone ||
      !/^01[0-9]{9}$/.test(phone) || // Valid BD number
      !address ||
      typeof address !== "string" ||
      !Array.isArray(items) ||
      items.length === 0 ||
      typeof total !== "number" ||
      total <= 0
    ) {
      return NextResponse.json(
        { success: false, error: "Invalid order data" },
        { status: 400 }
      );
    }

    // ✅ Validate each item
    const validItems = items.filter(
      (item) =>
        item &&
        typeof item.id === "string" &&
        item.id.trim() !== "" &&
        typeof item.quantity === "number" &&
        item.quantity > 0
    );

    if (validItems.length === 0) {
      return NextResponse.json(
        { success: false, error: "No valid order items" },
        { status: 400 }
      );
    }

    const orderId = generateOrderId();

    // Step 1: Create the order
    const createdOrder = await directus.request(
      createItem("orders", {
        order_id: orderId,
        name,
        phone,
        address,
        total,
        status: "pending",
        placed_at: getBangladeshTimeISO(),
      })
    );

    // Step 2: Create related order items
    await directus.request(
      createItems(
        "order_items",
        validItems.map((item) => ({
          order: createdOrder.id,
          product: item.id,
          quantity: item.quantity,
        }))
      )
    );

    return NextResponse.json({ success: true, order: createdOrder });
  } catch (error) {
    console.error("Order creation error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create order" },
      { status: 500 }
    );
  }
}
