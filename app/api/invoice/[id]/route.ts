import { NextRequest, NextResponse } from "next/server";
import { readItem } from "@directus/sdk";
import directus from "@/lib/directus";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}
// You must export a named `GET` function with correct type
export async function GET(_req: NextRequest, { params }: PageProps) {
  try {
    const { id } = await params;

    // Fetch order with relational items and products
    const order = await directus.request(
      readItem("orders", id, {
        fields: [
          "id",
          "name",
          "order_id",
          "phone",
          "address",
          "total",
          "placed_at",
          "order_items.id",
          "order_items.quantity",
          "order_items.product.id",
          "order_items.product.name",
          "order_items.product.price",
          "order_items.product.discounted_price",
        ],
      })
    );

    return NextResponse.json(order);
  } catch (error) {
    console.error("Error fetching invoice:", error);
    return NextResponse.json(
      { error: "Failed to load invoice" },
      { status: 500 }
    );
  }
}
