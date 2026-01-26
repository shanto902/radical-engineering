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

  const banglaFont = await readFile(
    join(process.cwd(), "assets/NotoSansBengali-Regular.ttf")
  );

  const project = await getProjectData(params.slug);

  return new ImageResponse(
    (
      <div
        style={{
          display: "flex", // required!
          flexDirection: "column", // required!
          position: "relative",
          width: "100%",
          height: "100%",
          fontFamily: '"Noto Sans Bengali", Lato', // fallback still here, but per element override below
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
              src={`${process.env.NEXT_PUBLIC_ASSETS_URL}${project.image}`}
              width={500} // required!
              height={500} // required!
              style={{
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
            {/* Project title — force Bangla font */}
            <h1
              style={{
                fontSize: "50px",
                fontWeight: "bold",
                margin: "0 0 20px 0",
                lineHeight: 1.2,
                fontFamily: "Noto Sans Bengali", // force here!
              }}
            >
              {project.title}
            </h1>

            {/* Tags — force English font */}
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
                      fontFamily: "Lato", // force English font for tags
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {/* Short description — force Bangla font */}
            <p
              style={{
                fontSize: "20px",
                lineHeight: 1.5,
                color: "#374151",
                overflow: "hidden",
                display: "-webkit-box",
                WebkitLineClamp: "2",
                WebkitBoxOrient: "vertical",
                fontFamily: "Noto Sans Bengali", // force here!
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
            display: "flex", // required for next/og
          }}
        >
          <img
            src={`${process.env.NEXT_PUBLIC_SITE_URL}logo-square.png`}
            width={112} // required!
            height={78} // required!
            style={{
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
          name: "Lato",
          data: latoRegular,
          style: "normal",
          weight: 400,
        },
        {
          name: "Noto Sans Bengali",
          data: banglaFont,
          style: "normal",
          weight: 400,
        },
      ],
    }
  );
}
