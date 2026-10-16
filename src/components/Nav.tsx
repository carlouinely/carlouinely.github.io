import { CvAction } from '~src/components/CvAction'
import { GitHubGlyph, MountainGlyph } from '~src/components/glyphs'
import { site } from '~src/site'

const SECTIONS = [
  { label: 'Work', hash: 'work' },
  { label: 'Experience', hash: 'experience' },
  { label: 'About', hash: 'about' },
] as const

export function Nav() {
  return (
    <header className="mx-auto w-full max-w-page px-24 py-24">
      <nav
        aria-label="Primary"
        className="flex items-center gap-9 rounded-pills bg-limestone px-24 py-12"
      >
        <a href="/" className="flex items-center gap-9 text-obsidian">
          <MountainGlyph />
          <span className="font-dm-sans text-body">{site.wordmark}</span>
        </a>

        <ul className="ml-auto flex items-center gap-9">
          {SECTIONS.map((section) => (
            <li key={section.hash}>
              <a
                href={`/#${section.hash}`}
                className="rounded-pills px-12 font-dm-sans text-body text-obsidian"
              >
                {section.label}
              </a>
            </li>
          ))}
        </ul>

        <a
          href={site.github}
          aria-label="GitHub"
          className="flex items-center px-12 py-4 text-obsidian"
        >
          <GitHubGlyph />
        </a>

        <CvAction />
      </nav>
    </header>
  )
}
