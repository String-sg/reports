export type ProjectStatus = "Building" | "Prototype" | "Maintenance" | "Deprecated"

export type Audience = "Teachers" | "Students" | "Admin Teams" | "All" | "Public Officers"

export type ProblemSpace = "Feedback" | "Discovery" | "Matching" | "Analytics" | "Learning" | "Visualisation"

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
      "Piloted in Hack for Public Good 2024. A structured repository of submitted problems designed to surface and prioritise real pain points. Top problem spaces: Education (32%), HR (25%), Healthcare (24%). As of 15 Jun 2025, Whine will no longer be running — key features are being migrated to String.",
    status: "Deprecated",
    since: "2024",
    audience: ["Public Officers"],
    problemSpace: ["Matching", "Analytics"],
    contributors: [
      // TODO: add real contributor names
    ],
    highlightStat: { value: "164", label: "problems submitted" },
    metrics: [
      { label: "Registered users", value: "568" },
      { label: "Problem submissions", value: "164" },
      { label: "Replies", value: "150" },
      {
        label: "Resolved",
        value: "18",
        description: "~11% resolution rate — posts with an accepted reply",
      },
      { label: "Total likes", value: "497" },
      { label: "Events hosted", value: "10" },
    ],
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
  {
    slug: "events",
    name: "Events",
    tagline: "Online and in-person sessions for tech learning and adoption.",
    description:
      "A programme of online and in-person sessions helping teachers and school admin teams learn and adopt technology tools. Focused on practical, classroom-ready skills for Singapore educators.",
    url: "https://events.string.sg",
    status: "Building",
    since: "2022",
    audience: ["Teachers", "Admin Teams"],
    problemSpace: ["Learning"],
    contributors: [
      // TODO: add real contributor names
    ],
    highlightStat: { value: "260", label: "educators impacted" },
    metrics: [
      { label: "Educators impacted", value: "260", description: "Across 3 events / series" },
      { label: "Events run", value: "3" },
    ],
    costPerQuarter: "$0",
    updates: [
      { date: "2025 Q4", body: "Q4 String Meetup x Stick 'Em — 45 participants, 13 Nov 2025." },
      { date: "2025 Q3", body: "AI Quick Dive for Educators — 15 participants, 28 Sept 2025." },
      { date: "2023 H1", body: "Tech Talk for Teachers series — 200 participants, run on Zoom." },
    ],
  },
  {
    slug: "diagrams",
    name: "Diagrams",
    tagline: "Interactive science diagrams for classroom use.",
    description:
      "A tool for creating and sharing interactive science diagrams, built to support teaching and learning in Singapore classrooms.",
    url: "https://diagrams.string.sg",
    status: "Building",
    since: "2026",
    audience: ["Teachers", "Students"],
    problemSpace: ["Visualisation"],
    contributors: [
      // TODO: add real contributor names
    ],
    highlightStat: { value: "WIP", label: "metrics coming soon" },
    metrics: [],
    costPerQuarter: "$0",
    updates: [],
  },
  {
    slug: "bingo",
    name: "Bingo",
    tagline: "Photo-based bingo for engaging professional development sessions.",
    description:
      "A photo-based bingo game designed to make professional development sessions more interactive and fun for educators.",
    url: "https://bingo.string.sg",
    status: "Maintenance",
    since: "2025",
    audience: ["Teachers"],
    problemSpace: ["Learning"],
    contributors: [
      // TODO: add real contributor names
    ],
    highlightStat: { value: "WIP", label: "metrics coming soon" },
    metrics: [],
    costPerQuarter: "$0",
    updates: [],
  },
]

export const AGGREGATE = {
  // Active: String (Building), Events (Building), Diagrams (Building), Bingo (Maintenance). Remarks Co-Pilot and Whine deprecated.
  totalProjects: 4,
  // Remarks Co-Pilot: 1,825 teachers. Whine: 109 teacher-domain users (@moe.gov.sg, @moe.edu.sg, @school.gov.sg, *.edu.sg).
  totalUsers: "1,934",
  // TODO: update once contributor list is finalised.
  totalVolunteers: "—",
  // Remarks Co-Pilot: $50/qtr. String, Events, Diagrams, Bingo: $0 (free tier).
  costPerQuarter: "$50",
}
