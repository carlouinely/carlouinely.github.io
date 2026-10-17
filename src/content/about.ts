/**
 * The About copy. The summary deliberately makes no duration claim: nothing here
 * can be disproved by subtracting the dates printed above it, and it stays short
 * because the About section sets it at lede scale on wide viewports. The stack
 * is grouped so a recruiter can keyword-match, and the working-style passage is
 * prose because a tool list cannot describe how the work happens.
 */
export type StackGroup = {
  label: string
  tools: string[]
}

export const about = {
  summary:
    "I'm a full-stack engineer from Cebu, Philippines, and a BSIT graduate of the University of San Carlos. I've shipped production web apps for scrappy startups and a company doing $5B a year, across the whole stack: polished frontends, solid backends, and the CI/CD that holds them together.",

  stack: [
    {
      label: 'Frontend',
      tools: ['TypeScript / JavaScript', 'React', 'TanStack', 'Next.js', 'ShadCN'],
    },
    { label: 'Backend', tools: ['Drizzle ORM', 'Better Auth', 'Postgres'] },
    { label: 'Infra', tools: ['Docker', 'Vite+'] },
  ] satisfies StackGroup[],

  howIWork: [
    'Agents are part of my team, not a novelty. I run on DeepSeek and OpenCode Go day to day, and hand longer multi-step work to the Pi Coding Agent through agent skills and MCP servers when a task needs them. The point is leverage: they take the repetitive scaffolding, so my time goes to the decisions that shape the product.',
    "My setup is deliberately boring and fast: Fedora Linux, with NeoVim for long keyboard-driven sessions and Zed when I'm reviewing or writing. The tools get out of the way so the work stays in front of me.",
  ],
}
