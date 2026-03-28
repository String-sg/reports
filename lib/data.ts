export type ProjectStatus = "Building" | "Prototype" | "Maintenance" | "Deprecated"

export type Audience = "Teachers" | "Students" | "Admin Teams" | "All" | "Public Officers"

export type ProblemSpace = "Feedback" | "Discovery" | "Matching" | "Analytics"

export interface Contributor {
  name: string
  role: string
  initials: string
  color: string
}

export interface Metric {
  label: string
  value: string
  delta?: string
  deltaPositive?: boolean
  description?: string
}

export interface Alternative {
  name: string
  url: string
  description: string
}

export interface Project {
  slug: string
  name: string
  tagline: string
  description: string
  url?: string
  status: ProjectStatus
  since: string
  audience: Audience[]
  problemSpace: ProblemSpace[]
  contributors: Contributor[]
  metrics: Metric[]
  costPerQuarter?: string
  updates: { date: string; body: string }[]
  highlightStat: { value: string; label: string }
  alternative?: Alternative
}

export const PROJECTS: Project[] = [
  {
    slug: "remarkscopilot",
    name: "Remarks Co-Pilot",
    tagline: "AI-assisted bulk feedback generator for teachers.",
    description:
      "Built in Q3 2023 as an extension of a hackathon project with Open Government Products. Now independently maintained as a citizen-run product. Helps teachers draft personalised student report descriptors at scale — cutting hours of repetitive writing into minutes.",
    url: "https://remarkscopilot.string.sg",
    status: "Deprecated",
    since: "2023",
    audience: ["Teachers"],
    problemSpace: ["Feedback"],
    contributors: [
      // TODO: add real contributor names
    ],
    highlightStat: { value: "1,825", label: "teachers reached" },
    metrics: [
      { label: "Total users", value: "1,825" },
      { label: "Remarks generated", value: "7,664", description: "2025 Q2" },
      {
        label: "Quarterly active users",
        value: "53,894",
        description: "2025 Q2 — verify metric definition",
      },
      { label: "Cost per quarter", value: "$50" },
    ],
    costPerQuarter: "$50",
    alternative: {
      name: "SmartCompose",
      url: "https://www.smartcompose.gov.sg",
      description:
        "SmartCompose is the recommended alternative for AI-assisted report writing, maintained by the Singapore government.",
    },
    updates: [
      {
        date: "2026 Q1",
        body: "Deprecated. Remarks Co-Pilot is no longer actively maintained. We recommend SmartCompose (smartcompose.gov.sg) as an alternative.",
      },
      {
        date: "2025 Q2",
        body: "Migrated out of beta.gov to maintain independently.",
      },
      {
        date: "Q1 2024 – Q1 2025",
        body: "Maintenance mode. No active feature development.",
      },
      {
        date: "2023 Q4",
        body: "Enabled users to edit and save their own prompts.",
      },
      {
        date: "2023 Q3",
        body: "Launched remarkscopilot.beta.gov.sg. Administered NPS Survey.",
      },
    ],
  },
  {
    slug: "string-solutions",
    name: "String — Solutions Aggregator",
    tagline: "Community-curated catalogue of edutech solutions.",
    description:
      "Piloted in Hack for Public Good 2023 to help public officers explore and adopt tech tools. Now continuing as a citizen-run product focused on educators — a searchable, community-maintained catalogue helping teachers discover vetted edutech solutions.",
    status: "Building",
    since: "2023",
    audience: ["Teachers", "Admin Teams"],
    problemSpace: ["Discovery"],
    contributors: [
      // TODO: add real contributor names
    ],
    highlightStat: { value: "4.4k", label: "new active users (2024)" },
    metrics: [
      { label: "Active users", value: "3.3k", description: "2023" },
      {
        label: "New active users",
        value: "4.4k",
        delta: "+33.7%",
        deltaPositive: true,
        description: "2024, up to Oct 2024",
      },
      { label: "Total views (2023)", value: "12.8k" },
      {
        label: "Total views (2024)",
        value: "14.2k",
        delta: "+10.9%",
        deltaPositive: true,
        description: "Up to Oct 2024",
      },
      {
        label: "Community solutions",
        value: "15",
        description: "For Teachers (2023)",
      },
      {
        label: "Total costs (HPG 2023)",
        value: "$13,608",
        description: "$408 managed infra + $13,200 est. manpower",
      },
    ],
    costPerQuarter: "$0",
    updates: [
      {
        date: "2025",
        body: "Rebuild in progress. Pivoting focus from public officers to educators. Stay tuned.",
      },
    ],
  },
  {
    slug: "whine",
    name: "Whine — Problem Bank",
    tagline: "Crowdsourcing issues and solutions from public officers.",
    description:
      "Piloted in Hack for Public Good 2024. A structured repository of submitted problems designed to surface and prioritise real pain points. As of 15 Jun 2025, Whine will no longer be running — key features are being migrated to String.",
    status: "Deprecated",
    since: "2024",
    audience: ["Public Officers"],
    problemSpace: ["Matching", "Analytics"],
    contributors: [
      // TODO: add real contributor names
    ],
    highlightStat: { value: "2024", label: "Hack for Public Good" },
    metrics: [],
    costPerQuarter: "$0",
    alternative: {
      name: "ForumSG",
      url: "https://forumsg.hack2026.gov.sg/sign-in",
      description:
        "ForumSG is the recommended community platform for public officers to learn, grow, and surface issues together.",
    },
    updates: [
      {
        date: "2025",
        body: "As of 15 Jun 2025, Whine will no longer be running. Key features are being migrated to String.",
      },
    ],
  },
]

export const AGGREGATE = {
  // Active: String (Building). Remarks Co-Pilot and Whine deprecated.
  totalProjects: 1,
  // 1,825 registered teachers on Remarks Co-Pilot (historical). TODO: update once String user count is available.
  totalUsers: "1,825+",
  // TODO: update once contributor list is finalised.
  totalVolunteers: "—",
  // Remarks Co-Pilot: $50/qtr. String: $0 (free tier).
  costPerQuarter: "$50",
}
