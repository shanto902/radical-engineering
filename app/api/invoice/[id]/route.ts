import { NextRequest, NextResponse } from "next/server";
import { readItem, updateItem } from "@directus/sdk";
import directus from "@/lib/directus";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export async function GET(_req: NextRequest, { params }: PageProps) {
  try {
    const { id } = await params;

    // Fetch the order with items and nested product prices
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
          "extra_charges",
        ],
      })
    );

    // Calculate subtotal of order items
    const itemTotal =
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      order.order_items?.reduce((sum: number, item: any) => {
        const product = item.product;
        if (!product) return sum;

        const price =
          product?.discounted_price != null
            ? parseFloat(product.discounted_price)
            : parseFloat(product.price || 0);

        return sum + item.quantity * price;
      }, 0) || 0;

    // Calculate total of extra charges
    const extraChargesTotal =
      order.extra_charges?.reduce((sum: number, charge: { cost: string }) => {
        return sum + parseFloat(charge.cost || "0");
      }, 0) || 0;

    // Calculate and round the final total
    const calculatedTotal =
      Math.round((itemTotal + extraChargesTotal) * 100) / 100;

    // Update the total in Directus
    await directus.request(
      updateItem("orders", id, {
        total: calculatedTotal,
      })
    );

    if (order.order_items) {
      for (const item of order.order_items) {
        const product = item.product;
        if (!product?.id) continue;

        try {
          // Get current total_sold
          const productData = await directus.request(
            readItem("products", product.id, { fields: ["total_sold"] })
          );

          const currentSold = parseInt(productData?.total_sold || "0", 10);
          const updatedSold = currentSold + item.quantity;

          // Update the total_sold field
          await directus.request(
            updateItem("products", product.id, {
              total_sold: updatedSold,
            })
          );
        } catch (err) {
          console.error(
            `Failed to update total_sold for product ${product.id}`,
            err
          );
        }
      }
    }

    // Return updated order with totals
    return NextResponse.json({
      ...order,
      total: calculatedTotal,
      item_subtotal: itemTotal,
      extra_charges_total: extraChargesTotal,
    });
  } catch (error) {
    console.error("Error calculating/updating order:", error);
    return NextResponse.json(
      { error: "Failed to calculate and update order total" },
      { status: 500 }
    );
  }
}
