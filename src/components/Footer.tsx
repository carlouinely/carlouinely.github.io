import { MountainGlyph } from '~src/components/glyphs'
import { site } from '~src/site'

/** The footer's five entry points, in scan order. */
const LINKS = [
  { label: 'Projects', href: '/projects' },
  { label: 'About me', href: '/#about' },
  { label: "Where I've worked", href: '/#experience' },
  { label: 'Email', href: `mailto:${site.email}` },
  { label: 'GitHub', href: site.github },
] as const

/**
 * The page closes with the wordmark, the five ways back into the site, and the
 * copyright line. There is no build credit: the footer is about the owner.
 */
export function Footer() {
  return (
    <footer className="mx-auto w-full max-w-page px-24 pb-40 pt-80">
      <div className="border-t-[1.5px] border-dotted border-obsidian" />
      <div className="mt-24 flex flex-wrap items-center justify-between gap-16 font-system-sans-serif text-caption text-obsidian">
        <span className="flex items-center gap-8 font-dm-sans text-body">
          <MountainGlyph />
          {site.wordmark}
        </span>

        <nav aria-label="Footer">
          <ul className="flex flex-wrap gap-x-16 gap-y-8">
            {LINKS.map((link) => (
              <li key={link.href}>
                <a href={link.href} className="font-dm-sans text-body text-obsidian underline">
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
