import { GitHubGlyph, LinkedInGlyph, MailGlyph } from '~src/components/glyphs'
import { site } from '~src/site'

/**
 * The owner's own profiles and address, listed once so a visitor has one place
 * to look for them. The GitHub and LinkedIn links carry `rel="me"`, so a
 * crawler reads them as the same person the nav's identity marks; the address
 * does not, because an inbox is not a profile.
 */
const EMAIL = { label: 'Email', href: `mailto:${site.email}`, Glyph: MailGlyph, me: false } as const

const PROFILES = [
  { label: 'GitHub', href: site.github, Glyph: GitHubGlyph, me: true },
  { label: 'LinkedIn', href: site.linkedin, Glyph: LinkedInGlyph, me: true },
] as const

const TONE = {
  light: 'text-obsidian hover:text-ember',
  dark: 'text-chalk hover:text-ember',
} as const

/**
 * The social row: one quiet typographic link per profile, each a small
 * monochrome mark beside its name. It is a link row rather than a set of pills,
 * because these are not the page's actions and should not compete with the one
 * that is. Under About it gathers the address and both profiles, and it repeats
 * in the footer where the closing ask already carries the address.
 */
export function SocialLinks({
  tone,
  includeEmail = false,
  className = '',
}: {
  tone: keyof typeof TONE
  includeEmail?: boolean
  className?: string
}) {
  const links = [...(includeEmail ? [EMAIL] : []), ...PROFILES]

  return (
    <ul className={`flex flex-wrap items-center gap-x-24 gap-y-8 ${className}`}>
      {links.map(({ label, href, Glyph, me }) => (
        <li key={label}>
          <a
            href={href}
            rel={me ? 'me' : undefined}
            className={`inline-flex items-center gap-8 font-dm-sans text-body transition-colors ${TONE[tone]}`}
          >
            <Glyph className="size-[1.25em] shrink-0" />
            {label}
          </a>
        </li>
      ))}
    </ul>
  )
}
