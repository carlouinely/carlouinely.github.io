import { CvAction } from '~src/components/CvAction'
import { MountainGlyph } from '~src/components/glyphs'
import { site } from '~src/site'

/**
 * The site's one closing block, and its only dark surface. Two groups: the ask
 * with the two actions a visitor can take from it, then the identity line under
 * a dotted rule.
 *
 * There is no site map here. The nav already carries every section, and each
 * surface offers its own way on, so a second set of links under the ask only
 * competed with it.
 *
 * The palette is inverted: the rule, the wordmark, and the outlined action are
 * Chalk where the rest of the page draws them in Obsidian. The address is the
 * outlined action and its own label rather than a generic "Email me", because
 * this is the block where a recruiter copies it, and `mailto:` still opens their
 * own client on a phone. Below `sm` the two actions stack and take the full
 * width, so they stay level with each other at the 360px floor.
 */
export function Footer() {
  return (
    <footer id="contact" data-reveal className="page-block bg-obsidian text-chalk">
      <div className="page-shell">
        <div className="flex flex-wrap items-center justify-between gap-x-40 gap-y-24">
          <h2 className="font-pp-neue-corp-compact text-heading-lg font-regular tracking-heading uppercase md:text-heading-2xl">
            Let&apos;s talk
          </h2>

          <div className="flex w-full flex-col gap-16 sm:w-auto sm:flex-row sm:items-center">
            <CvAction className="w-full justify-center sm:w-auto" />

            <a
              href={`mailto:${site.email}`}
              className="action-pill action-pill--dark w-full justify-center sm:w-auto"
            >
              {site.email}
            </a>
          </div>
        </div>

        <hr className="page-break border-0 border-t-[1.5px] border-dotted border-chalk" />

        <div className="page-gap flex flex-col gap-8">
          <span className="flex items-center gap-8">
            <MountainGlyph />
            <span className="font-dm-sans text-body">{site.wordmark}</span>
          </span>
          <span className="font-system-sans-serif text-caption text-chalk/70">
            © {new Date().getFullYear()} {site.wordmark}
          </span>
        </div>
      </div>
    </footer>
  )
}
