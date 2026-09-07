import { readFile } from "node:fs/promises";
import path from "node:path";
import { ImageResponse } from "next/og";
import { business, home } from "@/content/site";

export const alt = `${business.name} — ${business.sector}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
// Required so the image is generated at build time under `output: "export"`.
export const dynamic = "force-static";

export default async function OpengraphImage() {
  // The official lockup, inlined so satori can rasterise it.
  const logo = await readFile(
    path.join(process.cwd(), "public", "logo-official.png"),
  );
  const mark = `data:image/png;base64,${logo.toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#060809",
          // Satori has no blur filter, so the glow is a gradient rather than a
          // blurred shape.
          backgroundImage:
            "radial-gradient(circle at 78% -10%, rgba(0,227,140,0.22), rgba(6,8,9,0) 55%)",
          padding: "72px 80px",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column" }}>
          <img src={mark} width={340} height={136} alt="" />
          <div
            style={{
              display: "flex",
              marginTop: 40,
              fontSize: 76,
              fontWeight: 700,
              color: "#ffffff",
              letterSpacing: "-0.02em",
            }}
          >
            {business.name}
          </div>
          <div
            style={{
              display: "flex",
              marginTop: 20,
              fontSize: 34,
              color: "#A8B6BF",
              maxWidth: 900,
            }}
          >
            {home.hero.positioning}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderTop: "1px solid #1E272E",
            paddingTop: 28,
            fontSize: 24,
            color: "#7A8B96",
          }}
        >
          <div style={{ display: "flex" }}>{business.address.full}</div>
          <div style={{ display: "flex", color: "#00E38C" }}>
            {business.domain}
          </div>
        </div>
      </div>
    ),
    size,
  );
}
