import { fetchProducts } from "@/helper/fetchFromDirectus";
import { NextResponse } from "next/server";
import { stripHtml } from "string-strip-html";

export async function GET() {
  const products = await fetchProducts(); // Assuming this returns TProduct[]

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
    "google_product_category", // Optional but recommended
  ];

  const rows = products.map((p) => {
    const imageUrl = `https://admin.atiar.com.bd/assets/${p.image}`;
    const availability =
      p.status === "in-stock"
        ? "in stock"
        : p.status === "out-of-stock"
        ? "out of stock"
        : "preorder";

    const priceFormatted = `${p.price} BDT`;

    const title = p.name.replace(/"/g, "");
    const description = stripHtml(p.short_description || "").result.replace(
      /"/g,
      ""
    );

    const productUrl = `https://radicalengineering.com.bd/categories/${p.category?.slug}/${p.slug}`;

    return [
      p.sku,
      `"${title}"`,
      `"${description}"`,
      availability,
      "new",
      priceFormatted,
      productUrl,
      imageUrl,
      p.brand?.name || "Radical Engineering",
      "", // Optional: Google product category
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
