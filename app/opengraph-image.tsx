import { ImageResponse } from "next/og"
import { AGGREGATE, PROJECTS } from "@/lib/data"

export const alt = "String Reports — Impact metrics, updates and learnings from the String volunteer edutech ecosystem."
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

export default function OgImage() {
  const activeCount = AGGREGATE.totalProjects
  const teachersReached = AGGREGATE.totalUsers
  const volunteers = AGGREGATE.totalVolunteers

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundColor: "#1A1D1F",
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
          <p style={{ color: "#1A1D1F", fontSize: "0px", margin: 0 }}>.</p>
          <h1
            style={{
              color: "#F0F0F0",
              fontSize: "56px",
              fontWeight: 700,
              lineHeight: 1.1,
              margin: 0,
            }}
          >
            Metrics, updates
            <br />and learnings
          </h1>
          <p
            style={{
              color: "#9CA3AF",
              fontSize: "22px",
              margin: 0,
              lineHeight: 1.4,
              maxWidth: "700px",
            }}
          >
            String is a volunteer-run edutech ecosystem. We share our product
            metrics openly to stay accountable to the educators we build for.
          </p>
        </div>

        {/* Bottom: stats strip */}
        <div
          style={{
            display: "flex",
            gap: "48px",
            borderTop: "1px solid #3D4146",
            paddingTop: "32px",
          }}
        >
          {[
            { value: String(activeCount), label: "Active products" },
            { value: `${teachersReached}+`, label: "Teachers reached" },
            { value: `${volunteers}+`, label: "Volunteers" },
          ].map((stat) => (
            <div key={stat.label} style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
              <span style={{ color: "#F0F0F0", fontSize: "32px", fontWeight: 700 }}>{stat.value}</span>
              <span style={{ color: "#9CA3AF", fontSize: "14px" }}>{stat.label}</span>
            </div>
          ))}
        </div>
      </div>
    ),
    { ...size }
  )
}
