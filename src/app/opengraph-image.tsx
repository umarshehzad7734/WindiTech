import { ImageResponse } from "next/og";
import { business, home } from "@/content/site";

export const alt = `${business.name} — ${business.sector}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
// Required so the image is generated at build time under `output: "export"`.
export const dynamic = "force-static";

const markSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="140" height="140"><path d="M3 10.5C6.5 23 11 23 13.8 13.5c1.4-4.7 3-4.7 4.4 0C21 23 25.5 23 29 10.5" fill="none" stroke="#00E58C" stroke-width="4.2" stroke-linecap="round" stroke-linejoin="round"/></svg>`;

export default function OpengraphImage() {
  const mark = `data:image/svg+xml;base64,${Buffer.from(markSvg).toString("base64")}`;

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
            "radial-gradient(circle at 78% -10%, rgba(0,229,140,0.22), rgba(6,8,9,0) 55%)",
          padding: "72px 80px",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column" }}>
          <img src={mark} width={140} height={140} alt="" />
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
          <div style={{ display: "flex", color: "#00E58C" }}>
            {business.domain}
          </div>
        </div>
      </div>
    ),
    size,
  );
}
