import { ImageResponse } from "next/og"
import { PROJECTS } from "@/lib/data"

export const alt = "String Reports"
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

const STATUS_COLOR: Record<string, string> = {
  Building:    "#75F8CC",
  Maintenance: "#C0F4FB",
  Prototype:   "#FBD34D",
  Deprecated:  "rgba(255,255,255,0.3)",
}

const STATUS_BG: Record<string, string> = {
  Building:    "rgba(117,248,204,0.15)",
  Maintenance: "rgba(192,244,251,0.15)",
  Prototype:   "rgba(251,211,77,0.15)",
  Deprecated:  "rgba(255,255,255,0.05)",
}

export default async function OgImage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const project = PROJECTS.find((p) => p.slug === slug)

  // Fallback for unknown slugs
  if (!project) {
    return new ImageResponse(
      (
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#1A1D1F",
            color: "#F0F0F0",
            fontFamily: "sans-serif",
            fontSize: "32px",
          }}
        >
          String Reports
        </div>
      ),
      { ...size }
    )
  }

  const statusColor = STATUS_COLOR[project.status] ?? "#9CA3AF"
  const statusBg    = STATUS_BG[project.status]    ?? "rgba(255,255,255,0.05)"

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
        {/* Top: wordmark + status */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
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

          {/* Status badge */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              backgroundColor: statusBg,
              border: `1px solid ${statusColor}50`,
              borderRadius: "6px",
              padding: "6px 14px",
            }}
          >
            <div
              style={{
                width: "7px",
                height: "7px",
                borderRadius: "50%",
                backgroundColor: statusColor,
              }}
            />
            <span style={{ color: statusColor, fontSize: "14px", fontWeight: 600 }}>
              {project.status}
            </span>
          </div>
        </div>

        {/* Middle: project name + tagline */}
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <h1
            style={{
              color: "#F0F0F0",
              fontSize: "60px",
              fontWeight: 700,
              lineHeight: 1.1,
              margin: 0,
            }}
          >
            {project.name}
          </h1>
          <p
            style={{
              color: "#9CA3AF",
              fontSize: "24px",
              margin: 0,
              lineHeight: 1.4,
              maxWidth: "720px",
            }}
          >
            {project.tagline}
          </p>
        </div>

        {/* Bottom: highlight stat + since + audience */}
        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-between",
            borderTop: "1px solid #3D4146",
            paddingTop: "32px",
          }}
        >
          {/* Highlight stat */}
          <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
            <span style={{ color: "#75F8CC", fontSize: "13px", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase" }}>
              {project.highlightStat.label}
            </span>
            <span style={{ color: "#F0F0F0", fontSize: "40px", fontWeight: 700, lineHeight: 1 }}>
              {project.highlightStat.value}
            </span>
          </div>

          {/* Meta pills */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "8px" }}>
            <span style={{ color: "#9CA3AF", fontSize: "14px" }}>
              Since {project.since} · {project.audience.join(", ")}
            </span>
            {project.volunteers && (
              <span style={{ color: "#9CA3AF", fontSize: "14px" }}>
                {project.volunteers} volunteer{project.volunteers !== 1 ? "s" : ""}
              </span>
            )}
          </div>
        </div>
      </div>
    ),
    { ...size }
  )
}
