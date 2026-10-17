import { CvAction } from '~src/components/CvAction'
import { GitHubGlyph, MountainGlyph } from '~src/components/glyphs'
import { site } from '~src/site'

/** The site map: where else the closing block sends a visitor. */
const LINKS: ReadonlyArray<{ label: string; href: string }> = [
  { label: 'About me', href: '/#about' },
  { label: "Where I've worked", href: '/#experience' },
  { label: 'Projects', href: '/projects' },
]

/**
 * The site's one closing block. It used to be two: a dark "Let's talk" strip on
 * the home page and a light link row on every page, which left the ask and the
 * ways on from it in different places. One block means every Case Study closes
 * the way the home page does, and "what now" has a single answer.
 *
 * Three groups, in the order a visitor wants them: the ask with the one action
 * beside it, the address to copy, then the site map and the identity line.
 *
 * It is the site's only dark surface, so it wears the palette inverted: the
 * dotted rule, the wordmark, and the links are Chalk where the rest of the page
 * draws them in Obsidian. The address stays plain selectable text rather than a
 * mailto link, so a recruiter can copy it into whichever client they use.
 */
export function Footer() {
  return (
    <footer id="contact" data-reveal className="page-block bg-obsidian text-chalk">
      <div className="page-shell">
        <div className="flex flex-wrap items-center justify-between gap-x-24 gap-y-16">
          <h2 className="font-pp-neue-corp-compact text-heading-lg font-regular tracking-heading uppercase md:text-heading-2xl">
            Let&apos;s talk
          </h2>

          <CvAction className="w-full justify-center sm:w-auto" />
        </div>

        <div className="page-head flex flex-wrap items-baseline gap-x-24 gap-y-8">
          <p className="font-dm-sans text-body break-words select-all md:text-heading-sm">
            {site.email}
          </p>

          <a
            href={site.github}
            rel="me"
            className="inline-flex items-center gap-8 py-8 font-dm-sans text-body underline underline-offset-4 transition-colors hover:text-ember"
          >
            <GitHubGlyph />
            GitHub
          </a>
        </div>

        <hr className="page-break border-0 border-t-[1.5px] border-dotted border-chalk" />

        <div className="page-gap flex flex-wrap items-baseline justify-between gap-x-24 gap-y-12">
          <div className="flex flex-col gap-8">
            <span className="flex items-center gap-8">
              <MountainGlyph />
              <span className="font-dm-sans text-body">{site.wordmark}</span>
            </span>
            <span className="font-system-sans-serif text-caption text-chalk/70">
              © {new Date().getFullYear()} {site.wordmark}
            </span>
          </div>

          {/* The pills bleed their own padding, so the list cancels it to keep
              the first and last label flush with the grid. Below `sm` the row
              drops the horizontal padding instead, so all three labels hold one
              line at the 360px floor. */}
          <nav aria-label="Footer">
            <ul className="flex flex-wrap gap-x-12 gap-y-4 sm:-mx-12 sm:gap-x-8">
              {LINKS.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="block rounded-pills py-8 font-dm-sans text-body transition-colors hover:text-ember sm:px-12"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>
    </footer>
  )
}
