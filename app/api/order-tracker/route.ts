import { NextResponse } from "next/server";
import directus from "@/lib/directus";
import { readItems } from "@directus/sdk";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const mobile = searchParams.get("mobile");

  if (!mobile) {
    return NextResponse.json({ orders: [] });
  }

  try {
    const orders = await directus.request(
      readItems("orders", {
        filter: {
          phone: {
            _eq: mobile,
          },
        },
        sort: ["-placed_at"],
        fields: [
          "id",
          "order_id",
          "name",
          "status",
          "placed_at",
          "phone",
          "total",
          "address",
          "order_items.*",
          "order_items.product.name",
        ],
      })
    );

    return NextResponse.json({ orders });
  } catch (err) {
    console.error("Order Tracker API error:", err);
    return NextResponse.json({ orders: [] });
  }
}
