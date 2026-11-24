import { ImageResponse } from "next/og"
import { homeImpact } from "@/lib/reporting/home-impact"

export const alt = "String Reports — Impact metrics, updates and learnings from the String volunteer edutech ecosystem."
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundColor: "#f6f8f7",
          padding: "64px",
          fontFamily: "sans-serif",
        }}
      >
        {/* Top: wordmark */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div
            style={{
              width: "10px",
              height: "10px",
              borderRadius: "50%",
              backgroundColor: "#75F8CC",
            }}
          />
          <span style={{ color: "#75F8CC", fontSize: "16px", fontWeight: 600, letterSpacing: "0.05em" }}>
            STRING REPORTS
          </span>
        </div>

        {/* Middle: heading */}
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <p style={{ color: "#f6f8f7", fontSize: "0px", margin: 0 }}>.</p>
          <h1
            style={{
              color: "#33373B",
              fontSize: "56px",
              fontWeight: 700,
              lineHeight: 1.1,
              margin: 0,
            }}
          >
            String Reports
          </h1>
          <p
            style={{
              color: "#64736e",
              fontSize: "22px",
              margin: 0,
              lineHeight: 1.4,
              maxWidth: "700px",
            }}
          >
            Teaching and learning · All-time reported impact
          </p>
        </div>

        {/* Bottom: stats strip */}
        <div
          style={{
            display: "flex",
            gap: "48px",
            borderTop: "1px solid #dfe6e2",
            paddingTop: "32px",
          }}
        >
          {homeImpact.map((stat) => (
            <div key={stat.label} style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
              <span style={{ color: "#33373B", fontSize: "32px", fontWeight: 700 }}>{stat.value}</span>
              <span style={{ color: "#64736e", fontSize: "14px" }}>{stat.label}</span>
            </div>
          ))}
        </div>
      </div>
    ),
    { ...size }
  )
}
