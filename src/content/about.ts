/**
 * The About copy. The summary paragraph deliberately makes no duration claim —
 * nothing here can be disproved by subtracting the dates printed above it. The
 * stack is grouped so a recruiter can keyword-match, and the working-style
 * passage is prose because a tool list cannot describe how the work happens.
 */
export type StackGroup = {
  label: string
  tools: string[]
}

export const about = {
  summary:
    'Full-stack engineer who ships production web applications for clients ranging from startups to enterprises, the largest at $5B in ARR. I work across the whole stack — polished frontends, scalable backends, and the CI/CD that connects them — and treat AI as core to the workflow rather than a novelty. My work spans PE-firm clients and music and nightlife brands, plus agentic pipelines that handle lead sourcing, site auditing, and outreach end to end.',

  stack: [
    {
      label: 'Frontend',
      tools: ['TypeScript / JavaScript', 'React', 'TanStack', 'Next.js', 'ShadCN'],
    },
    { label: 'Backend', tools: ['Drizzle ORM', 'Better Auth', 'Postgres'] },
    { label: 'Infra', tools: ['Docker', 'Vite+'] },
  ] satisfies StackGroup[],

  howIWork: [
    'I treat agents as a real part of the team rather than a novelty. The day-to-day toolchain runs on DeepSeek and OpenCode Go, with the Pi Coding Agent driving longer multi-step work through agent skills and Model Context Protocol (MCP) servers where a task calls for them. The point is leverage: the agents take the repetitive scaffolding, and I spend the time on the decisions that shape the product.',
    'The environment is deliberately boring and fast — Fedora Linux, in NeoVim or Zed depending on the shape of the task. NeoVim for long, keyboard-driven sessions; Zed when a lighter editor suits reviewing and writing. The tooling disappears so the work stays in front of me.',
  ],

  degree: 'Bachelor of Science in Information Technology, University of San Carlos',
}
