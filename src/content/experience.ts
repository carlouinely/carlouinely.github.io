/**
 * The employment history, in the order it renders: reverse-chronological, with
 * DEVGO Studio appearing once as a merged card because the two freelance
 * engagements are one ongoing on-call relationship, not a gap to explain.
 *
 * Every bullet states an outcome, not a responsibility, and no summary claims a
 * duration — the printed dates are the only timeline a reader needs.
 */
export type Engagement = 'Freelance' | 'Full-time'

export type Experience = {
  employer: string
  title: string
  dates: string
  engagement: Engagement
  summary: string
  outcomes: string[]
}

export const experience: Experience[] = [
  {
    employer: 'DEVGO Studio',
    title: 'Software Engineer',
    dates: 'Mar 2024 – Aug 2025 · Mar 2026 – present',
    engagement: 'Freelance',
    summary:
      "An ongoing on-call freelance relationship across the studio's client work — engaged again whenever a project needs a hand.",
    outcomes: [
      "Took an artist's SEO-focused site from concept to launch, growing their organic discoverability.",
      'Built an offline-capable ERP spanning point of sale, inventory, and accounting for a two-venue nightlife business.',
    ],
  },
  {
    employer: 'Zaigo',
    title: 'Software Engineer',
    dates: 'Sep 2025 – Feb 2026',
    engagement: 'Full-time',
    summary:
      'Product engineering for clients from early-stage startups to a company generating $5B in ARR.',
    outcomes: [
      'Won a long-term retainer by pitching client-specific mockups instead of generic outreach.',
      'Built an internal agentic pipeline that sources leads, scores their websites, and auto-emails low-scoring prospects a custom mockup.',
    ],
  },
  {
    employer: 'Project 11 Advertising',
    title: 'DevOps Engineer',
    dates: 'May 2025 – Aug 2025',
    engagement: 'Freelance',
    summary:
      'Freelance infrastructure work that gave an advertising agency a core system it fully owned.',
    outcomes: [
      'Self-hosted ERPNext and later Odoo on a VPS through Coolify, replacing a system the company did not control.',
      'Streamlined deployments so the team could ship and maintain systems without heavy manual work.',
      'Centralised monitoring to cut downtime, then moved the company to a better-fit ERP.',
    ],
  },
  {
    employer: 'Velez College Supreme Student Council',
    title: 'WordPress Developer',
    dates: 'Sep 2024 – Oct 2024',
    engagement: 'Freelance',
    summary: "Freelance build of an e-commerce platform for the council's merchandise.",
    outcomes: [
      "Launched an e-commerce platform for the council's merchandise, speeding up on-campus purchasing for students.",
      'Gave the organisation a dedicated sales channel that cut manual handling and improved the buying experience.',
    ],
  },
]
