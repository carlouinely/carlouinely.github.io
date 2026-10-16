/**
 * Every volatile site value lives here. Swapping the wordmark, real name,
 * email, GitHub URL, canonical origin, title, description, or availability
 * label is a one-file edit; nothing else hard-codes them.
 */
export const site = {
  /** The brand name. Deliberately not the legal name. */
  wordmark: 'carlouinely',

  /** The legal name, shown in the hero and in About/CV copy so recruiters can resolve the handle. */
  name: 'Jan Carlo Juab',

  role: 'Full-Stack Engineer',

  location: 'Cebu, Philippines',

  // TODO(placeholder): replace with a real, deliverable address before launch.
  // The address on the current CV must never enter git history. See PLACEHOLDERS.md.
  email: 'hello@carlouinely.example',

  github: 'https://github.com/carlouinely',

  // TODO(placeholder): replace with the custom domain's origin once it exists. See PLACEHOLDERS.md.
  origin: 'https://carlouinely.github.io',

  defaultTitle: 'carlouinely — Full-Stack Engineer',

  description:
    'Jan Carlo Juab is a full-stack engineer based in Cebu, Philippines, open to full-time roles.',

  availability: 'OPEN TO FULL-TIME ROLES',
} as const
