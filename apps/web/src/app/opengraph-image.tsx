import { ImageResponse } from "next/og";
import { site } from "@/lib/site";

export const runtime = "edge";
export const alt = site.name;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "#0a0a0a",
          color: "#fafafa",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "80px",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div
            style={{
              fontSize: 24,
              letterSpacing: "0.25em",
              color: "#a3a3a3",
              textTransform: "uppercase",
            }}
          >
            Monorepo SaaS starter
          </div>
          <div style={{ fontSize: 88, fontWeight: 700, lineHeight: 1.05, maxWidth: 980 }}>
            The Next.js + Supabase boilerplate, ready to fork.
          </div>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            fontSize: 28,
            color: "#a3a3a3",
          }}
        >
          <div style={{ fontWeight: 600, color: "#fafafa" }}>{site.name}</div>
          <div>Next.js · Supabase · Tailwind · shadcn</div>
        </div>
      </div>
    ),
    { ...size },
  );
}
