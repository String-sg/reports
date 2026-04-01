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
  learnMoreUrl?: string
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
  volunteers?: number
  metrics: Metric[]
  costPerQuarter?: string
  updates: { date: string; body: string }[]
  highlightStat: { value: string; label: string }
  alternative?: Alternative
  // Contributes to the aggregate "Teachers reached" stat on the home page.
  // Use teacher-domain filtered counts, not raw totals where applicable.
  teacherImpact?: number
}

export const PROJECTS: Project[] = [
  {
    slug: "remarkscopilot",
    volunteers: 10,
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
    teacherImpact: 1825,
    highlightStat: { value: "61,252", label: "remarks generated" },
    metrics: [
      { label: "Total users", value: "1,825" },
      { label: "Remarks generated", value: "61,252", description: "Across all quarters, 2023 Q3 – 2025 Q2" },
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
    volunteers: 5,
    name: "String — Solutions Aggregator",
    tagline: "Community-curated catalogue of edutech solutions.",
    url: "https://string.sg",
    description:
      "Piloted in Hack for Public Good 2023 to help public officers explore and adopt tech tools. Now continuing as a citizen-run product focused on educators — a searchable, community-maintained catalogue helping teachers discover vetted edutech solutions.",
    status: "Building",
    since: "2023",
    audience: ["Teachers", "Admin Teams"],
    problemSpace: ["Discovery"],
    contributors: [
      // TODO: add real contributor names
    ],
    highlightStat: { value: "7k+", label: "unique views" },
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
    volunteers: 2,
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
    // 109 = teacher-domain filtered count from User.csv (@moe.gov.sg, @moe.edu.sg, @school.gov.sg, *.edu.sg)
    teacherImpact: 109,
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
      name: "LaunchPad",
      url: "https://launchpad.tech.gov.sg/",
      learnMoreUrl: "https://www.tech.gov.sg/products-and-services/for-government-agencies/productivity-and-marketing/launchpad/",
      description:
        "LaunchPad allows Singapore's public officers to experience the features of generative AI and the capabilities of large language models.",
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
    volunteers: 10,
    name: "Events",
    tagline: "Online and in-person sessions for tech learning and adoption.",
    description:
      "A programme of online and in-person sessions helping teachers and school admin teams learn and adopt technology tools. Focused on practical, classroom-ready skills for Singapore educators.",
    status: "Building",
    since: "2022",
    audience: ["Teachers", "Admin Teams"],
    problemSpace: ["Learning"],
    contributors: [
      // TODO: add real contributor names
    ],
    teacherImpact: 527,
    highlightStat: { value: "527", label: "educators impacted" },
    metrics: [
      { label: "Educators impacted", value: "527" },
      { label: "Events run", value: "9" },
    ],
    costPerQuarter: "$0",
    updates: [
      { date: "2026 Q1", body: "Can AI Become Your Teaching Assistant? (Round IV) @ Lorong AI — 80 participants, 17 Mar 2026." },
      { date: "2025 Q4", body: "Q4 String Meetup x Stick 'Em — 45 participants, 13 Nov 2025." },
      { date: "2025 Q3", body: "AI Quick Dive for Educators — 15 participants, 28 Sept 2025." },
      { date: "2025 Q3", body: "String Q3 Meetup @ Google — 38 participants, 3 Sept 2025." },
      { date: "2025 Q3", body: "AI-yo: How Teachers Turned Painpoints into Solutions — 17 participants, 30 Jul 2025." },
      { date: "2025 Q2", body: "Supporting Schools via a Product-centric Approach — 24 participants, 29 May 2025." },
      { date: "2025 Q2", body: "Educational Value of AI Talking Heads — 8 participants, 29 Apr 2025 (Zoom)." },
      { date: "2024 Q2", body: "Tech Summit @ SST Lab School 2024 — 100 participants in truncated design sprint, 30 May 2024." },
      { date: "2023 H1", body: "Tech Talk for Teachers series — 200 participants, run on Zoom." },
    ],
  },
  {
    slug: "diagrams",
    volunteers: 2,
    teacherImpact: 187,
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
    volunteers: 2,
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
    teacherImpact: 195,
    highlightStat: { value: "WIP", label: "metrics coming soon" },
    metrics: [],
    costPerQuarter: "$0",
    updates: [],
  },
  {
    slug: "matcher",
    name: "MatCHER",
    tagline: "Efficiently connect with relief/flexi adjunct teachers matching your needs.",
    description:
      "A platform that helps schools efficiently find and connect with relief and flexi-adjunct teachers. Matches school postings with available teachers under the Flexi-Adjunct Teaching Scheme (FAJT), reducing the friction of sourcing short-term teaching support.",
    url: "https://go.gov.sg/matcher",
    status: "Building",
    since: "2026",
    audience: ["Teachers", "Admin Teams"],
    problemSpace: ["Matching"],
    contributors: [
      // TODO: add real contributor names
    ],
    teacherImpact: 31,
    highlightStat: { value: "46", label: "contact requests enabled" },
    metrics: [
      { label: "Active teachers", value: "31", description: "Supply — as of 29 Mar 2026" },
      { label: "New teachers this week", value: "12", description: "Supply — week of 29 Mar 2026" },
      { label: "By scheme (FAJT)", value: "31", description: "Flexi-Adjunct Teaching Scheme" },
      { label: "Open postings", value: "16", description: "Demand — as of 29 Mar 2026" },
      { label: "New postings this week", value: "6", description: "Demand — week of 29 Mar 2026" },
      { label: "Postings filled (all time)", value: "3" },
      { label: "Contact requests enabled", value: "46", description: "Via Matcher" },
    ],
    costPerQuarter: "$0",
    updates: [
      {
        date: "2026 Q1",
        body: "Platform Summary (29 Mar 2026): 31 active teachers, 16 open postings, 3 postings filled all time, 46 contact requests enabled via Matcher.",
      },
    ],
  },
]

export const AGGREGATE = {
  // Active: String (Building), Events (Building), Diagrams (Building), Bingo (Maintenance), MatCHER (Building). Remarks Co-Pilot and Whine deprecated.
  totalProjects: 5,
  // Auto-computed: sum of teacherImpact across all projects.
  // To update, set teacherImpact on the relevant project above.
  totalUsers: PROJECTS.reduce((sum, p) => sum + (p.teacherImpact ?? 0), 0).toLocaleString(),
  // Auto-computed: sum of volunteers across all projects (unique volunteers may overlap — treat as effort-slots).
  totalVolunteers: PROJECTS.reduce((sum, p) => sum + (p.volunteers ?? 0), 0),
  // Remarks Co-Pilot: $50/qtr. String, Events, Diagrams, Bingo: $0 (free tier).
  costPerQuarter: "$50",
}
