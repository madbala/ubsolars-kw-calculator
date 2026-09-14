import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "UB Solars — Free TNEB Solar kW Calculator";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "64px 72px",
          background: "linear-gradient(135deg, #042f2e 0%, #0f766e 55%, #b45309 100%)",
          color: "#fff",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div
            style={{
              width: 72,
              height: 72,
              borderRadius: 20,
              background: "rgba(255,255,255,0.15)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 40,
            }}
          >
            ☀️
          </div>
          <div style={{ fontSize: 42, fontWeight: 800, letterSpacing: -1 }}>UB Solars</div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ fontSize: 64, fontWeight: 800, lineHeight: 1.05, letterSpacing: -1.5, maxWidth: 980 }}>
            Size smarter. Save brighter.
          </div>
          <div style={{ fontSize: 28, opacity: 0.92, maxWidth: 900, lineHeight: 1.35 }}>
            Free TNEB solar calculator — bill → kW, subsidy, EMI &amp; savings
          </div>
        </div>

        <div style={{ display: "flex", fontSize: 22, opacity: 0.85 }}>
          Tamil Nadu rooftop solar · No signup · Instant estimate
        </div>
      </div>
    ),
    { ...size },
  );
}
