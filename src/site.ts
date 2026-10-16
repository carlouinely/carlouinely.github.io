/**
 * Every volatile site value lives here. Swapping the wordmark, email, GitHub
 * URL, canonical origin, title, description, availability label, or shared
 * brand asset is a one-file edit; nothing else hard-codes them.
 */
export const site = {
  /** The brand name, and the only name the site uses. */
  wordmark: 'carlouinely',

  role: 'Full-Stack Engineer',

  location: 'Cebu, Philippines',

  // TODO(placeholder:email): replace with a real, deliverable address before launch.
  // The address on the current CV must never enter git history. See PLACEHOLDERS.md.
  email: 'hello@carlouinely.example',

  github: 'https://github.com/carlouinely',

  // TODO(placeholder:origin): replace with the custom domain's origin once it exists. See PLACEHOLDERS.md.
  origin: 'https://carlouinely.github.io',

  defaultTitle: 'carlouinely | Full-Stack Engineer',

  description:
    "Full-stack engineer in Cebu, Philippines. I build web apps end to end and I'm open to full-time work.",

  availability: 'Open to full-time roles',

  /** Shared brand assets referenced from the document head. */
  assets: {
    // TODO(placeholder:favicon): replace with a real mark. See PLACEHOLDERS.md.
    favicon: '/favicon.svg',
    // TODO(placeholder:apple-touch-icon): replace with a real 180px square. See PLACEHOLDERS.md.
    appleTouchIcon: '/apple-touch-icon.png',
    // TODO(placeholder:open-graph-image): replace with a real share image. See PLACEHOLDERS.md.
    openGraphImage: '/og-image.png',
  },
} as const

/** The absolute URL for a site path, for canonical and Open Graph tags. */
export function siteUrl(path = '/'): string {
  return `${site.origin.replace(/\/+$/, '')}${path.startsWith('/') ? path : `/${path}`}`
}
