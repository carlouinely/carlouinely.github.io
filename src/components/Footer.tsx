import { MountainGlyph } from '~src/components/glyphs'
import { site } from '~src/site'

/** The footer's five entry points, in scan order. */
const LINKS: ReadonlyArray<{ label: string; href: string; rel?: string }> = [
  { label: 'Projects', href: '/projects' },
  { label: 'About me', href: '/#about' },
  { label: "Where I've worked", href: '/#experience' },
  { label: 'Email', href: `mailto:${site.email}` },
  // `rel="me"` marks the GitHub profile as the same person this site is about.
  { label: 'GitHub', href: site.github, rel: 'me' },
]

/**
 * The page closes with the wordmark, the five ways back into the site, and the
 * copyright line. There is no build credit: the footer is about the owner.
 */
export function Footer() {
  return (
    <footer className="page-shell page-block">
      <div className="border-t-[1.5px] border-dotted border-obsidian" />
      <div className="page-gap flex flex-wrap items-center justify-between gap-16 font-system-sans-serif text-caption text-obsidian">
        <span className="flex items-center gap-8 font-dm-sans text-body">
          <MountainGlyph />
          {site.wordmark}
        </span>

        <nav aria-label="Footer">
          <ul className="flex flex-wrap gap-x-16 gap-y-8">
            {LINKS.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  rel={link.rel}
                  className="font-dm-sans text-body text-obsidian underline"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <span>
          © {new Date().getFullYear()} {site.wordmark}
        </span>
      </div>
    </footer>
  )
}
