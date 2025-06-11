/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
import { getProjectData } from "@/helper/fetchFromDirectus";
import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

// Image metadata
export const alt = "Projects | Radical Engineering";
export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

// Image generation
export default async function Image({ params }: { params: { slug: string } }) {
  const latoRegular = await readFile(
    join(process.cwd(), "assets/Lato-Regular.ttf")
  );

  const project = await getProjectData(params.slug);

  return new ImageResponse(
    (
      <div
        style={{
          position: "relative",
          width: "100%",
          height: "100%",
          fontFamily: "Inter",
        }}
      >
        {/* Main flex content */}
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
            height: "100%",
            padding: "60px",
            background: "#f9fafb",
            color: "#111827",
          }}
        >
          {/* Left side - Project Image */}
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
              src={`${process.env.NEXT_PUBLIC_ASSETS_URL}${project.image}?format=png`}
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

          {/* Right side - Project Info */}
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
              {project.title}
            </h1>
            {project.tags && (
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "8px",
                  marginBottom: "16px",
                }}
              >
                {project.tags.map((tag, i) => (
                  <span
                    key={i}
                    style={{
                      fontSize: "16px",
                      padding: "4px 8px",
                      backgroundColor: "#e5e7eb",
                      borderRadius: "6px",
                      color: "#374151",
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
            <p
              style={{
                fontSize: "20px",
                lineHeight: 1.5,
                color: "#374151",
                overflow: "hidden",
                display: "-webkit-box",
                WebkitLineClamp: "2",
                WebkitBoxOrient: "vertical",
              }}
            >
              {project.short_description}
            </p>
          </div>
        </div>

        {/* Logo - absolutely positioned OUTSIDE the flex flow */}
        <div
          style={{
            position: "absolute",
            top: "40px",
            right: "40px",
            display: "flex", // required to satisfy next/og
          }}
        >
          <img
            src={`${process.env.NEXT_PUBLIC_SITE_URL}logo-square.png`}
            alt="Logo"
            style={{
              width: "112px",
              height: "78px",
              borderRadius: "5px",
            }}
          />
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
