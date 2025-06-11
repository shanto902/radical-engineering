/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
import { fetchProductData } from "@/helper/fetchFromDirectus";
import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

// Image metadata
export const alt = "Product | Radical Engineering";
export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

// Image generation
export default async function Image({
  params,
}: {
  params: { product_slug: string };
}) {
  // Load font
  const latoRegular = await readFile(
    join(process.cwd(), "assets/Lato-Regular.ttf")
  );

  const product = await fetchProductData(params.product_slug);
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "60px",
          background: "#f9fafb",
          color: "#111827",
          fontFamily: "Inter",
          position: "relative", // make sure parent is relative
        }}
      >
        {/* Logo in top-left corner */}
        <img
          src={`${process.env.NEXT_PUBLIC_SITE_URL}logo-square.png`}
          alt="Logo"
          style={{
            position: "absolute",
            top: "40px",
            right: "40px",
            width: "112px",
            height: "78px",
            borderRadius: "5px",
          }}
        />

        {/* Left side - Product Image */}
        <div
          style={{
            flex: "1 1 50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            paddingRight: "40px",
          }}
        >
          <img
            src={`${process.env.NEXT_PUBLIC_ASSETS_URL}${product.image}?format=png`}
            style={{
              width: "500px",
              height: "500px",
              objectFit: "contain",
              backgroundColor: "white",
              borderRadius: "16px",
              border: "2px solid #e5e7eb",
            }}
          />
        </div>

        {/* Right side - Product Info */}
        <div
          style={{
            flex: "1 1 50%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            paddingLeft: "40px",
          }}
        >
          <h1
            style={{
              fontSize: "50px",
              fontWeight: "bold",
              margin: "0 0 20px 0",
              lineHeight: 1.2,
            }}
          >
            {product.name}
          </h1>
          <p
            style={{
              fontSize: "36px",
              fontWeight: "600",
              color: "#1f2937",
              marginBottom: "20px",
            }}
          >
            Price: &nbsp;
            {product.discounted_price
              ? product.discounted_price
              : product.price}{" "}
            BDT
          </p>
          <p
            style={{
              fontSize: "20px",
              lineHeight: 1.5,
              color: "#374151",
              lineClamp: "2",
            }}
          >
            {product.short_description}
          </p>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        {
          name: "Inter",
          data: latoRegular,
          style: "normal",
          weight: 400,
        },
      ],
    }
  );
}
