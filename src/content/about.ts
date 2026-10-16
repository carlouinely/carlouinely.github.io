/**
 * The About copy. The summary paragraph deliberately makes no duration claim:
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
    "I'm a full-stack engineer from Cebu, Philippines, and a BSIT graduate of the University of San Carlos. I've shipped production web apps for everyone from scrappy startups to a company doing $5B a year. I like working across the whole stack: polished frontends, solid backends, and the CI/CD that holds them together. I treat AI as part of the team, not a party trick. My work has run from PE-firm clients to music and nightlife brands, plus agentic pipelines that source leads, audit sites, and send outreach on their own.",

  stack: [
    {
      label: 'Frontend',
      tools: ['TypeScript / JavaScript', 'React', 'TanStack', 'Next.js', 'ShadCN'],
    },
    { label: 'Backend', tools: ['Drizzle ORM', 'Better Auth', 'Postgres'] },
    { label: 'Infra', tools: ['Docker', 'Vite+'] },
  ] satisfies StackGroup[],

  howIWork: [
    'Agents are part of my team, not a novelty. I run on DeepSeek and OpenCode Go day to day, and hand longer multi-step work to the Pi Coding Agent through agent skills and MCP servers when a task needs them. The point is leverage. The agents take the repetitive scaffolding, and I spend my time on the decisions that shape the product.',
    "My setup is deliberately boring and fast: Fedora Linux, with NeoVim or Zed depending on the shape of the task. NeoVim for long keyboard-driven sessions, Zed when I'm reviewing or writing. The tools get out of the way so the work stays in front of me.",
  ],
}
