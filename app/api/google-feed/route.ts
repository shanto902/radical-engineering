import { fetchProducts } from "@/helper/fetchFromDirectus";
import { NextResponse } from "next/server";
import { stripHtml } from "string-strip-html";

/**
 * Map Directus category slugs to Google's product taxonomy
 */
function mapToGoogleCategory(slug: string): string {
  switch (slug) {
    case "solar-panels":
      return "Electronics > Solar > Solar Panels";
    case "battery":
      return "Electronics > Electronics Accessories > Batteries";
    case "inverter":
      return "Electronics > Power > Power Inverters";
    case "ips":
      return "Electronics > Power > Uninterruptible Power Supplies";
    case "cable-and-connector":
      return "Electronics > Electronics Accessories > Power Cords";
    case "charge-controller":
      return "Electronics > Solar > Solar Charge Controllers";
    case "accessories":
      return "Electronics > Electronics Accessories";
    default:
      return "Electronics";
  }
}

export async function GET() {
  const products = await fetchProducts(); // TProduct[]

  const header = [
    "id",
    "title",
    "description",
    "availability",
    "condition",
    "price",
    "link",
    "image_link",
    "brand",
    "google_product_category",
  ];

  const rows = products.map((p) => {
    const availability =
      p.status === "in-stock"
        ? "in stock"
        : p.status === "out-of-stock"
        ? "out of stock"
        : "preorder";

    const title = p.name.replace(/"/g, "");
    const description = stripHtml(p.short_description || "").result.replace(
      /"/g,
      ""
    );

    const productUrl = `https://radicalengineering.com.bd/categories/${p.category?.slug}/${p.slug}`;
    const imageUrl = p.image
      ? `https://admin.atiar.com.bd/assets/${p.image}?width=800&height=800&fit=cover`
      : "";

    const googleCategory = mapToGoogleCategory(p.category?.slug || "");

    return [
      p.sku,
      `"${title}"`,
      `"${description}"`,
      availability,
      "new",
      `${p.price} BDT`,
      productUrl,
      imageUrl,
      p.brand?.name || "Radical Engineering",
      googleCategory,
    ].join(",");
  });

  const csv = [header.join(","), ...rows].join("\n");

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv",
      "Content-Disposition": "attachment; filename=google_product_feed.csv",
    },
  });
}
